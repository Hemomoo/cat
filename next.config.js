/** @type {import('next').NextConfig} */
const nextConfig = {
  // 确保使用 App Router
  experimental: {
    // 如果你使用的是 Next.js 13.4 或更高版本，这个配置不再需要
    // appDir: true,
  },
  // 处理 Node.js 模块在客户端的问题
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
};


export default nextConfig;