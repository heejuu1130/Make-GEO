import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDefaultUser } from '@/lib/defaultUser'
import { crawlProductPage, calculateCredits } from '@/lib/firecrawl'
import { analyzeProduct } from '@/lib/claude'
import { z } from 'zod'
import { Category } from '@/types'

const schema = z.object({
  url: z.string().url(),
  category: z.enum(['beauty', 'food', 'clothing', 'other']).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '올바른 URL을 입력해주세요.' }, { status: 400 })
  }

  const user = await getDefaultUser()
  const { url } = parsed.data
  const category = (parsed.data.category ?? user.category ?? 'beauty') as Category

  const product = await prisma.product.create({
    data: { userId: user.id, url, category, status: 'analyzing' },
  })

  runAnalysis(product.id, url, category, user.id).catch(
    (err) => console.error('Analysis failed:', err)
  )

  return NextResponse.json({ productId: product.id })
}

async function runAnalysis(productId: string, url: string, category: Category, userId: string) {
  try {
    const { markdown, imageUrls, title } = await crawlProductPage(url)
    const creditsRequired = calculateCredits(imageUrls.length)
    const result = await analyzeProduct(markdown, category, url)

    await prisma.product.update({
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
    })
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
