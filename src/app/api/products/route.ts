import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { getDefaultUser } from '@/lib/defaultUser'

export async function GET() {
  const user = await getDefaultUser()

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      title: true,
      category: true,
      status: true,
      imageCount: true,
      creditsUsed: true,
      errorMessage: true,
      createdAt: true,
    },
  })

  return NextResponse.json(products)
}
