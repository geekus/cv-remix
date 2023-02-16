import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import { extractStyles } from 'evergreen-ui'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'

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
  const { css, hydrationScript } = extractStyles()
  let markup = renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} />
    </CacheProvider>
  )

  const chunks = extractCriticalToChunks(markup)
  const styles = constructStyleTagsFromChunks(chunks)

  markup = markup.replace('__STYLES__', styles + `<style>${css}</style>`)
  markup = markup.replace('__SCRIPT__', renderToString(hydrationScript))

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
