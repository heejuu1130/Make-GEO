import FirecrawlApp from '@mendable/firecrawl-js'

function getFirecrawl() {
  return new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })
}

export interface CrawlResult {
  markdown: string
  imageUrls: string[]
  title: string
}

export async function crawlProductPage(url: string): Promise<CrawlResult> {
  const result = await getFirecrawl().scrapeUrl(url, {
    formats: ['markdown'],
    includeTags: ['img', 'h1', 'h2', 'h3', 'p', 'li', 'table'],
  })

  if (!result.success) {
    throw new Error(`크롤링 실패: ${url}`)
  }

  const markdown = result.markdown ?? ''

  // Extract image URLs from markdown and metadata
  const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g
  const imageUrls: string[] = []
  let match
  while ((match = imgRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1])
  }

  const title = result.metadata?.title ?? ''

  return { markdown, imageUrls, title }
}

export function calculateCredits(imageCount: number): number {
  if (imageCount <= 3) return 1
  if (imageCount <= 6) return 2
  return 3
}
