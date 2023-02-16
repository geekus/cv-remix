import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Button, Heading, Label, Textarea } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { prisma } from '~/utils/prisma.server'
import type { ActionFunction, LoaderArgs } from '@remix-run/node'

export const loader = async ({ params }: LoaderArgs) => {
  const { cvId } = params

  if (!cvId) {
    throw Error()
  }

  const cv = await prisma.cv.findUnique({
    where: { id: cvId },
    include: { Consultant: { include: { User: true } } },
  })

  if (!cv) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json({ cv: cv })
}

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData()
  const { summary } = Object.fromEntries(formData)
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.searchParams)
  const { cvId } = params

  if (typeof cvId !== 'string') {
    throw Error('Missing param cvId')
  }

  switch (request.method) {
    case 'POST':
      if (typeof summary !== 'string') {
        throw Error('Missing summary')
      }

      await prisma.cv.update({
        where: { id: cvId },
        data: { summary: summary },
      })

      return null
    case 'PUT':
      switch (searchParams.get('action')) {
        case 'ADD_PROJECT':
          prisma.project.create({ data: { clientId: clientId } })
          return null
        default:
          return null
      }
    case 'DELETE':
      await prisma.cv.delete({ where: { id: cvId } })
      return null
    default:
      return null
  }
}

export default () => {
  const { cv } = useLoaderData<typeof loader>()
  const [summaryValue, setSummaryValue] = useState<string>('')

  useEffect(() => {
    setSummaryValue(cv.summary ?? '')
  }, [cv.summary])

  return (
    <div>
      <h1>Edit {cv.id}</h1>
      <Form method="post">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          name="summary"
          value={summaryValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setSummaryValue(e.target.value)
          }
        />
        <Button type="submit">Save</Button>
      </Form>
      <Heading>Projects</Heading>
      <Form method="patch" action="?action=ADD_PROJECT">
        <Button appearance="primary" type="submit">
          Add project
        </Button>
      </Form>
    </div>
  )
}
