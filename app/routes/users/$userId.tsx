import type { Consultant } from '@prisma/client'
import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'
import { getUrl, routes } from '~/routes'
import { Button } from 'evergreen-ui'

export const loader = async ({ params }: LoaderArgs) => {
  const { userId } = params
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const consultants = await prisma.consultant.findMany({
    where: { userId: userId },
  })
  const cvs = await prisma.cv.findMany()

  if (!user) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json({ user, consultants, cvs })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { id } = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST':
      // await prisma.cv.create({ data: {} })
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
  const { user, consultants, cvs } = useLoaderData<typeof loader>()

  return (
    <div>
      User {JSON.stringify(user)}
      <ul>
        {consultants.map((consultant: Consultant) => (
          <li key={consultant.id}>
            {consultant.id}
            {cvs.map((cv) => (
              <Link key={cv.id} to={getUrl(routes.cvs.edit(cv.id))}>
                edit cv
              </Link>
            ))}
            <Form method="put" action="?action=CREATE_CV">
              <button type="submit">Create CV</button>
            </Form>
          </li>
        ))}
      </ul>
      <Form action="/consultants" method="post">
        <input type="hidden" name="userId" value={user.id} />
        <Button type="submit">Create consultant</Button>
      </Form>
    </div>
  )
}
