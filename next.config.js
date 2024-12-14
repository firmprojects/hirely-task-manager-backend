/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    const { NormalModuleReplacementPlugin } = require('webpack');
    config.plugins.push(
      new NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      })
    );

    config.resolve.fallback = {
      stream: require.resolve('stream-browserify'),
    };

    return config;
  },
  transpilePackages: ['swagger-ui-react'],
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://hirely-task-manager-backend.vercel.app',
  }
};

module.exports = nextConfig;
