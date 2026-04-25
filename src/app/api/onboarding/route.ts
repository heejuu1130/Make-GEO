import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  category: z.enum(['beauty', 'food', 'clothing', 'other']),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const { category } = schema.parse(body)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { category, onboarded: true },
  })

  return NextResponse.json({ ok: true })
}
