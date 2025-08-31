const path = require('path')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const { SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, HEROKU_SLUG_COMMIT, NODE_ENV } = process.env

/** @type {import("next").NextConfig} */
module.exports = {
  swcMinify: true,
  productionBrowserSourceMaps: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    API: process.env.API,
    APP_ENV: process.env.APP_ENV,
    DEBUG: process.env.DEBUG,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  webpack: (config, options) => {
    const { isServer } = options

    if (isServer) {
      const [externals] = config.externals

      // eslint-disable-next-line no-param-reassign
      config.externals = (ctx, callback) => {
        if (path.isAbsolute(ctx.request)) {
          return callback()
        }

        return externals(ctx, callback)
      }
    }

    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      HEROKU_SLUG_COMMIT &&
      NODE_ENV === 'production'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          stripPrefix: ['webpack://_N_E/'],
          urlPrefix: '~/_next',
          release: `sellers@${HEROKU_SLUG_COMMIT}`,
        }),
      )
    }

    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'none'`,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31557600; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/comprar/:step*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ]
  },
}
