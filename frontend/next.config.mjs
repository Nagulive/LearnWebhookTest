/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8080/api/:path*' // Proxy to Backend container
      }
    ]
  },
  output: 'standalone',
};

export default nextConfig;
