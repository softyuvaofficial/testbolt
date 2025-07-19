/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // output: 'export',  // is line ko comment ya delete kar dijiye
};

module.exports = nextConfig;
