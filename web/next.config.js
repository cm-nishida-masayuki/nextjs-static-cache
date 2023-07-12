const withExportImages = require("next-export-optimize-images");

/** @type {import('next').NextConfig} */
const nextConfig = withExportImages({
  output: process.env.STANDALONE === "true" ? "standalone" : "export",
  trailingSlash: true,
  // images: {
  //   unoptimized: true,
  // },
  experimental: {
    instrumentationHook: false,
  },
});

module.exports = nextConfig;
