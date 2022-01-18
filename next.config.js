const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const csp = `
  child-src 'self' blob: *.codesandbox.io;
  connect-src *;
  default-src 'self';
  font-src 'self';
  img-src * blob: data:;
  media-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.usefathom.com;
  style-src 'self' 'unsafe-inline';
`
  .replace(/^\s+/, "")
  .trim();

/**
 * @returns {import("next/dist/server/config-shared").NextConfig}
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = (phase) => ({
  env: {
    VERCEL: phase == PHASE_DEVELOPMENT_SERVER ? true : process.env.VERCEL,
  },

  eslint: {
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },

  // https://github.com/vercel/next.js/blob/canary/packages/next/server/config-shared.ts#L110
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
    workerThreads: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp.replace(/\n/g, ""),
          },

          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },

          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  productionBrowserSourceMaps: true,

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: Boolean(process.env.VERCEL),
  },

  webpack(config, { dev, webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: dev,
        __PROD__: !dev,
      }),
    );

    return config;
  },
});
