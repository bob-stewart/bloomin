import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import {
  buildSeedReturnResponse,
  createSeedReturnRecord,
  requestOpenRouterBloom,
  validateSeedReturnPayload
} from './server/seedkind-api.mjs';
import { composeNextPrompt } from './src/seedkind.mjs';

const { Pool } = pg;
const PORT = Number(process.env.PORT || 4173);
const MAX_JSON_BYTES = 64 * 1024;
const distDir = path.resolve(fileURLToPath(new URL('./dist', import.meta.url)));

const baseHeaders = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff'
};

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp']
]);

let pool;
let schemaPromise;

function sslConfig() {
  const sslMode = String(process.env.PGSSLMODE || '').toLowerCase();

  if (sslMode === 'disable' || process.env.PGSSL === 'false') {
    return undefined;
  }

  if (
    sslMode === 'require' ||
    process.env.PGSSL === 'true' ||
    String(process.env.DATABASE_URL || '').includes('sslmode=require')
  ) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PG_POOL_MAX || 4),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
      ssl: sslConfig()
    });
  }

  return pool;
}

function ensureSchema(db) {
  if (!schemaPromise) {
    schemaPromise = db.query(`
      CREATE TABLE IF NOT EXISTS seed_returns (
        id uuid PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        source_domain text NOT NULL,
        stage text NOT NULL,
        petal text NOT NULL,
        return_seed_text text NOT NULL,
        parsed_fields jsonb NOT NULL,
        name text,
        email text,
        consent_to_return boolean NOT NULL,
        permission_to_contact boolean NOT NULL DEFAULT false,
        feeling_before integer,
        feeling_after integer,
        efficacy_note text,
        openrouter_model text,
        bloom_response jsonb NOT NULL
      );

      CREATE INDEX IF NOT EXISTS seed_returns_created_at_idx
        ON seed_returns (created_at DESC);

      CREATE INDEX IF NOT EXISTS seed_returns_stage_idx
        ON seed_returns (stage);
    `);
  }

  return schemaPromise;
}

async function insertSeedReturn(record) {
  const db = getPool();

  if (!db) {
    const error = new Error('Eden database is not configured.');
    error.statusCode = 503;
    throw error;
  }

  await ensureSchema(db);
  await db.query(
    `
      INSERT INTO seed_returns (
        id,
        source_domain,
        stage,
        petal,
        return_seed_text,
        parsed_fields,
        name,
        email,
        consent_to_return,
        permission_to_contact,
        feeling_before,
        feeling_after,
        efficacy_note,
        openrouter_model,
        bloom_response
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb)
    `,
    [
      record.id,
      record.sourceDomain,
      record.stage,
      record.petal,
      record.returnSeedText,
      JSON.stringify(record.parsedFields),
      record.name,
      record.email,
      record.consentToReturn,
      record.permissionToContact,
      record.feelingBefore,
      record.feelingAfter,
      record.efficacyNote,
      record.openrouterModel,
      JSON.stringify(record.bloomResponse)
    ]
  );
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    ...baseHeaders,
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(body));
}

function sendError(response, statusCode, message, details = []) {
  sendJson(response, statusCode, {
    ok: false,
    errors: [message, ...details].filter(Boolean)
  });
}

async function readJsonBody(request) {
  const chunks = [];
  let total = 0;

  for await (const chunk of request) {
    total += chunk.length;

    if (total > MAX_JSON_BYTES) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

async function handleSeedReturn(request, response) {
  if (request.method !== 'POST') {
    response.writeHead(405, {
      ...baseHeaders,
      Allow: 'POST'
    });
    response.end();
    return;
  }

  let payload;

  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
    return;
  }

  const validation = validateSeedReturnPayload(payload);

  if (!validation.ok) {
    sendError(response, 400, 'Eden needs a little more structure before it can tend this seed.', validation.errors);
    return;
  }

  const db = getPool();

  if (!db) {
    sendError(response, 503, 'Eden storage is not configured yet.');
    return;
  }

  try {
    await ensureSchema(db);
  } catch (error) {
    console.error('seed_return_schema_failed', {
      message: error.message,
      code: error.code || null
    });
    schemaPromise = null;
    sendError(response, 503, 'Eden storage is not ready yet.');
    return;
  }

  const nextPrompt = composeNextPrompt(validation.value.seed);
  const id = randomUUID();
  const bloomResult = await requestOpenRouterBloom({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || '~openai/gpt-latest',
    siteUrl: process.env.OPENROUTER_SITE_URL || 'https://bloomin.institute',
    seed: validation.value.seed,
    nextPrompt,
    survey: validation.value
  });
  const record = createSeedReturnRecord({
    id,
    value: validation.value,
    bloom: bloomResult.bloom,
    model: bloomResult.model,
    openrouterMeta: bloomResult.openrouterMeta
  });

  try {
    await insertSeedReturn(record);
  } catch (error) {
    console.error('seed_return_insert_failed', {
      message: error.message,
      code: error.code || null
    });
    sendError(response, error.statusCode || 503, 'Eden could not store this seed yet.');
    return;
  }

  sendJson(
    response,
    200,
    buildSeedReturnResponse({
      id,
      value: validation.value,
      bloom: bloomResult.bloom,
      stored: true
    })
  );
}

function healthPayload() {
  return {
    ok: true,
    service: 'bloomin',
    eden: {
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY)
    }
  };
}

async function serveStatic(request, response, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const requestPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = path.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.resolve(distDir, `.${normalizedPath}`);

  if (!filePath.startsWith(distDir)) {
    sendError(response, 403, 'Forbidden.');
    return;
  }

  let resolvedPath = filePath;
  let fileStat;

  try {
    fileStat = await stat(resolvedPath);
  } catch {
    resolvedPath = path.join(distDir, 'index.html');
    fileStat = await stat(resolvedPath);
  }

  if (fileStat.isDirectory()) {
    resolvedPath = path.join(resolvedPath, 'index.html');
    fileStat = await stat(resolvedPath);
  }

  const ext = path.extname(resolvedPath);
  const contentType = mimeTypes.get(ext) || 'application/octet-stream';
  const isAsset = resolvedPath.includes(`${path.sep}assets${path.sep}`);

  response.writeHead(200, {
    ...baseHeaders,
    'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Content-Length': fileStat.size,
    'Content-Type': contentType
  });
  createReadStream(resolvedPath).pipe(response);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  try {
    if (url.pathname === '/api/health') {
      sendJson(response, 200, healthPayload());
      return;
    }

    if (url.pathname === '/api/seed-return') {
      await handleSeedReturn(request, response);
      return;
    }

    await serveStatic(request, response, url.pathname);
  } catch (error) {
    if (error instanceof URIError) {
      sendError(response, 400, 'Bad request path.');
      return;
    }

    console.error('server_request_failed', {
      message: error.message,
      code: error.code || null
    });
    sendError(response, 500, 'Bloomin could not tend this request.');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Bloomin listening on ${PORT}`);
});

async function shutdown() {
  server.close();

  if (pool) {
    await pool.end();
  }
}

process.on('SIGTERM', () => {
  shutdown().finally(() => process.exit(0));
});

process.on('SIGINT', () => {
  shutdown().finally(() => process.exit(0));
});
