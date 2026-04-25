import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { crawlProductPage, calculateCredits } from '@/lib/firecrawl'
import { analyzeProduct } from '@/lib/claude'
import { z } from 'zod'
import { Category } from '@/types'

const schema = z.object({
  url: z.string().url(),
  category: z.enum(['beauty', 'food', 'clothing', 'other']).optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '올바른 URL을 입력해주세요.' }, { status: 400 })
  }

  const { url } = parsed.data

  // Get current user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, category: true },
  })
  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  const category = (parsed.data.category ?? user.category ?? 'beauty') as Category

  // Create pending product record
  const product = await prisma.product.create({
    data: {
      userId: session.user.id,
      url,
      category,
      status: 'analyzing',
    },
  })

  // Run analysis asynchronously (fire and forget pattern)
  runAnalysis(product.id, url, category, user.credits, session.user.id).catch(
    (err) => console.error('Analysis failed:', err)
  )

  return NextResponse.json({ productId: product.id })
}

async function runAnalysis(
  productId: string,
  url: string,
  category: Category,
  userCredits: number,
  userId: string
) {
  try {
    // Step 1: Crawl
    const { markdown, imageUrls, title } = await crawlProductPage(url)

    const creditsRequired = calculateCredits(imageUrls.length)

    // Check credits
    if (userCredits < creditsRequired) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          status: 'error',
          errorMessage: `크레딧이 부족합니다. 필요: ${creditsRequired}, 보유: ${userCredits}`,
        },
      })
      return
    }

    // Step 2: AI analysis
    const result = await analyzeProduct(markdown, category, url)

    // Step 3: Save results & deduct credits
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          title: result.structuredData.title || title || url,
          status: 'done',
          imageCount: imageUrls.length,
          creditsUsed: creditsRequired,
          structuredData: JSON.stringify(result.structuredData),
          faqData: JSON.stringify(result.faqData),
          jsonLd: JSON.stringify(result.jsonLd),
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: creditsRequired } },
      }),
    ])
  } catch (err) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        status: 'error',
        errorMessage: err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.',
      },
    })
  }
}
