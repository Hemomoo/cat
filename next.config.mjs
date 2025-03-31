/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        // 添加 Turbopack 规则
        '**/*.{js,jsx,ts,tsx}': {
          loader: 'next-babel-loader',
        },
      },
    },
  },
  // ... 其他配置保持不变
};

export default nextConfig;