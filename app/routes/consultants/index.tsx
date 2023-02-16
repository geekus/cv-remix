import type { User } from '@prisma/client'
import type { ActionFunction } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'

export const loader = async (): Promise<{ users: User[] }> => {
  const users = await prisma.user.findMany()

  return { users }
}

type LoaderData = Awaited<ReturnType<typeof loader>>

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { id, userId } = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST':
      if (typeof userId !== 'string') {
        throw Error('missing userId')
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user) {
        throw Error('User not found')
      }

      await prisma.consultant.create({
        data: {
          userId: userId,
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
  const { users } = useLoaderData<LoaderData>()

  return (
    <>
      <Form method="post">
        <button type="submit">Create user</button>
      </Form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>
              {user.id} {user.email}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  )
}
