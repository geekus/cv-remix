import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'

export const loader = async () => {
  const users = await prisma.user.findMany()
  const cvs = await prisma.cv.findMany()

  return json({ users, cvs })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { id, userId } = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST':
      if (typeof userId !== 'string') {
        throw Error()
      }
      const consultants = await prisma.consultant.findMany({
        where: { userId: userId },
      })

      if (consultants.length > 1) {
        throw Error('userId matches more than one consultant')
      }

      await prisma.cv.create({
        data: { summary: '', consultantId: consultants[0].id },
      })

      return null
    case 'DELETE':
      if (typeof id !== 'string') {
        throw Error()
      }
      return null
    default:
      return null
  }
}

export default () => {
  const { users, cvs } = useLoaderData<typeof loader>()

  return (
    <>
      <Form method="post">
        <select name="userId">
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.id} {user.email}
            </option>
          ))}
        </select>
        <button type="submit">Create CV</button>
      </Form>
      <hr />
      {cvs.map((cv) => (
        <li key={cv.id}>
          <Link to={`/cvs/edit/${cv.id}`}>Edit {cv.id}</Link>
        </li>
      ))}
      <hr />
      <Outlet />
    </>
  )
}
