import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDefaultUser } from '@/lib/defaultUser'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getDefaultUser()

  const product = await prisma.product.findFirst({
    where: { id: params.id, userId: user.id },
  })

  if (!product) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({
    ...product,
    structuredData: product.structuredData ? JSON.parse(product.structuredData) : null,
    faqData: product.faqData ? JSON.parse(product.faqData) : null,
    jsonLd: product.jsonLd ? JSON.parse(product.jsonLd) : null,
  })
}
