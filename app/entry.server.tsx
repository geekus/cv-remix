import { PassThrough } from 'stream'
import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
// import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { renderToString } from 'react-dom/server'
import { extractStyles } from 'evergreen-ui'
// import { ServerStyleSheet } from 'styled-components'

/* Getting styled components working? https://gist.github.com/ryanflorence/b7f1653404b350483909609e435a8a2d*/

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
const ABORT_DELAY = 5000

const key = 'css'
const cache = createCache({ key })
const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache)

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { css } = extractStyles()
  let markup = renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} />
    </CacheProvider>
  )

  const chunks = extractCriticalToChunks(markup)
  const styles = constructStyleTagsFromChunks(chunks)

  markup = markup.replace('__STYLES__', styles + `<style>${css}</style>`)

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   const sheet = new ServerStyleSheet()
//
//   let markup = renderToString(
//     sheet.collectStyles(
//       <RemixServer context={remixContext} url={request.url} />
//     )
//   )
//
//   const styles = sheet.getStyleTags()
//
//   markup = markup.replace('__STYLES__', styles)
//
//   responseHeaders.set('Content-Type', 'text/html')
//
//   return new Response('<!DOCTYPE html>' + markup, {
//     status: responseStatusCode,
//     headers: responseHeaders,
//   })
// }

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   return isbot(request.headers.get('user-agent'))
//     ? handleBotRequest(
//         request,
//         responseStatusCode,
//         responseHeaders,
//         remixContext
//       )
//     : handleBrowserRequest(
//         request,
//         responseStatusCode,
//         responseHeaders,
//         remixContext
//       )
// }

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady() {
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          didError = true

          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          const body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(error: unknown) {
          didError = true

          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
