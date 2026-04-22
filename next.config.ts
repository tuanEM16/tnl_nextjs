/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],

    dangerouslyAllowLocalIP: true, 

    localPatterns: [
      {
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;