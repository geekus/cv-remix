import type { MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { createGlobalStyle } from 'styled-components'
import { extractStyles } from 'evergreen-ui'
import LogRocket from 'logrocket'
import { getUrl, routes } from '~/routes'
import { MyButton } from '~/components/MyButton'

LogRocket.init('thyndr/cv')

LogRocket.identify('user1234', {
  name: 'Test Testesen',
  email: 'hi@eple.dev',
})

const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => (props.whiteColor ? 'white' : 'black')};
  }

  button {
    cursor: pointer;
  }
`

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'CV',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  // const { css, hydrationScript } = extractStyles()
  // {typeof document === 'undefined' ? '__STYLES__' : null}
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* {hydrationScript} */}
        <GlobalStyle />
        <header>
          <nav>
            <ul>
              <li>
                <Link to={getUrl(routes.clients())}>Clients</Link>
              </li>
              <li>
                <Link to={getUrl(routes.consultants())}>Consultants</Link>
              </li>
            </ul>
          </nav>
          <MyButton>Min knapp</MyButton>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
