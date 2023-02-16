import type { Client, Project } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'

interface LoaderData {
  clients: Client[]
  projects: Project[]
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const clients = await prisma.client.findMany()
  const projects = await prisma.project.findMany()
  console.log('pjs', projects)

  return { clients, projects }
}

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.searchParams)
  const formData = await request.formData().then(Object.fromEntries)

  switch (request.method) {
    case 'POST':
      const { name } = formData
      if (typeof name !== 'string') {
        throw Error()
      }
      await prisma.client.create({ data: { name: name } })
      return null
    case 'PUT':
      switch (searchParams.get('action')) {
        case 'ADD_PROJECT':
          const { clientId, name, description } = formData

          if (typeof clientId !== 'string') {
            throw Error('Missing required clientId')
          }
          if (typeof name !== 'string') {
            throw Error('Missing required name')
          }
          if (typeof description !== 'string') {
            throw Error('Missing required description')
          }

          const project = await prisma.project.create({
            data: {
              clientId: clientId,
              name: name,
              fromDate: new Date().toISOString(),
              toDate: new Date().toISOString(),
              description: description,
            },
          })

          return project
        default:
          return null
      }
    case 'DELETE':
      const { id } = formData

      if (typeof id !== 'string') {
        throw Error('Missing required id')
      }

      return null
    default:
      return null
  }
}

export default () => {
  const { clients, projects }: LoaderData = useLoaderData<typeof loader>()

  return (
    <>
      <h1>Clients</h1>
      <Form method="post">
        <ul>
          {clients.map((client) => (
            <li key={client.id}>{client.name}</li>
          ))}
        </ul>
        <input type="text" name="name" />
        <button type="submit">Add Client</button>
      </Form>
      <hr />
      <Form method="put" action="?action=ADD_PROJECT">
        <select name="clientId">
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.id} {client.name}
            </option>
          ))}
        </select>
        <input type="text" name="name" />
        <textarea name="description" />
        <button type="submit">Add project for client</button>
      </Form>
      <hr />
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/project/edit/${project.id}`}>Edit {project.id}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <Outlet />
    </>
  )
}
