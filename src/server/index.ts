import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import debug from 'debug'
import express from 'express'
import next from 'next'

// TODO: Research why rootStatic has to be the last middleware

const logger = debug('sellers:server:index')

const port = process.env.PORT || 3000

const dev = process.env.NODE_ENV === 'development'

const proxyServerIps = process.env.IP_PROXY_SERVER ? [process.env.IP_PROXY_SERVER] : []

const app = next({ dev })

const handle = app.getRequestHandler()

// @ts-expect-error TS2339 - `app` is not defined in global
global.app = app

const appHandler = () => {
  const server = express()

  server.set('trust proxy', ['uniquelocal', ...proxyServerIps])

  server.use(cookieParser())

  server.use(compression())

  server.use(bodyParser.urlencoded({ extended: true }))

  server.use(bodyParser.json())

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    logger(`Server ready at http://localhost:${port}`)
  })
}

app.prepare().then(appHandler)
