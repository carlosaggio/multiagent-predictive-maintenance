/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to avoid double renders in dev
  reactStrictMode: false,
  
  // Use webpack instead of turbopack for more stable builds
  experimental: {
    // Optimize memory usage
    workerThreads: false,
    cpus: 1,
  },
  
  // Increase stability for large codebases
  webpack: (config, { isServer }) => {
    // Prevent memory issues with large bundles
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
