/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
	// Disable ESLint during build to prevent circular dependency errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build if needed (optional fallback)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
