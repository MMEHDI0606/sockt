const { execSync } = require('child_process');

let allowedDevOrigins = [];
try {
  // Query local ngrok API to find the active tunnel hostname
  const res = execSync('curl -s http://127.0.0.1:4040/api/tunnels', { encoding: 'utf8' });
  const data = JSON.parse(res);
  if (data && data.tunnels) {
    data.tunnels.forEach(t => {
      const hostname = t.public_url.replace(/^https?:\/\//, '');
      allowedDevOrigins.push(hostname);
    });
  }
} catch (e) {
  // Fallback to allow any origin if ngrok is not running yet
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: allowedDevOrigins.length > 0 ? allowedDevOrigins : ['*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // Disable Turbopack, use Webpack instead
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      { source: '/dashboard/slack', destination: '/dashboard/configure/slack', permanent: false },
      { source: '/dashboard/llm-keys', destination: '/dashboard/configure/keys', permanent: false },
      { source: '/dashboard/deployments', destination: '/dashboard/deploy', permanent: false },
      { source: '/dashboard/teams', destination: '/dashboard/deploy', permanent: false },
      { source: '/dashboard/agents', destination: '/dashboard/deploy', permanent: false },
      { source: '/dashboard/tools', destination: '/dashboard/deploy', permanent: false },
      { source: '/dashboard/users', destination: '/dashboard/deploy', permanent: false },
    ];
  },
};

module.exports = nextConfig;
