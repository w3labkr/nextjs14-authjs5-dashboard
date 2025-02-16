// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suggested: We strongly suggest you enable Strict Mode in your Next.js application to better prepare your application for the future of React.
  reactStrictMode: process.env.NODE_ENV === 'production',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
