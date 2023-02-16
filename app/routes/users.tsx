import type { User } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'

export const loader: LoaderFunction = async (): Promise<{ users: User[] }> => {
  const users = await prisma.user.findMany()

  return { users }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { id } = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST':
      console.log('POST')
      await prisma.user.create({
        data: {
          email: 'havard.ranum@gmail.com',
          password: 'abc123',
        },
      })

      return null
    case 'DELETE':
      if (typeof id !== 'string') {
        throw Error('')
      }
      return null
    default:
      return null
  }
}

export default () => {
  const { users } = useLoaderData()
  return (
    <>
      <Form method="post">
        <button type="submit">Create user</button>
      </Form>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.id}</Link>
            {user.id}
          </li>
        ))}
      </ul>
      <input />
      <Outlet />
    </>
  )
}
