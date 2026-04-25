import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const product = await prisma.product.findFirst({
    where: { id: params.id, userId: session.user.id },
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
