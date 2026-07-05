import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const launchHosts = [
  'bloomin.institute',
  'www.bloomin.institute',
  'bloomin.foundation',
  'www.bloomin.foundation',
  'bloom.giving',
  'www.bloom.giving',
  'bloom.gdn',
  'www.bloom.gdn'
];

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: launchHosts
  },
  preview: {
    allowedHosts: launchHosts
  }
});
