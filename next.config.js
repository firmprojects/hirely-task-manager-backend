/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['swagger-ui-react'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://hirely-task-manager-backend.vercel.app',
  }
};

module.exports = nextConfig;
