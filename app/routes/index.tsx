import path from 'path'
import { Link } from '@remix-run/react'

export const routes = {
  consultants: () => 'consultants',
  clients: () => 'clients',
  cvs: { edit: (id: string) => path.join('cvs', 'edit', id) },
}

export const getUrl = (route: string) => {
  return path.join('/', route)
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix!</h1>
      <ul>
        <li>
          <Link to="/store">Go to store</Link>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
