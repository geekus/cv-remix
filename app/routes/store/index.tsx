import type { StoreItem } from '@prisma/client'
import type { ActionFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'
import { createStoreItem } from '~/utils/store.server'

export const loader = async (): Promise<StoreItem[]> => {
  const result = await prisma.storeItem.findMany()

  return result
}

export const action: ActionFunction = async ({ request }) => {
  console.log('action', request.method)
  const formData = await request.formData()
  const { id } = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST':
      const result = await createStoreItem({ title: 'test2' })
      return result
    case 'DELETE':
      if (typeof id !== 'string') {
        throw Error('')
      }
      await prisma.storeItem.delete({
        where: { id: id },
      })
      return null
    default:
      return null
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  console.log('data', data)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to the Store!</h1>
      <Form method="post">
        <button type="submit">Create item</button>
      </Form>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.title}{' '}
            <Form method="delete">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit">&times;</button>
            </Form>
          </li>
        ))}
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
