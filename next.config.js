/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['swagger-ui-react'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://hirely-task-backend.netlify.app',
  }
};

module.exports = nextConfig;
