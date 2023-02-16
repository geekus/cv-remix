import { prisma } from './prisma.server'
import type { StoreItem } from '@prisma/client'

export const createStoreItem = async ({ title }: Omit<StoreItem, 'id'>) => {
  const storeItem = await prisma.storeItem.create({
    data: {
      title: title,
    },
  })

  return storeItem
}
