export type Category = 'beauty' | 'food' | 'clothing' | 'other'
export type Plan = 'free' | 'starter' | 'growth' | 'pro'
export type ProductStatus = 'pending' | 'analyzing' | 'done' | 'error'

export interface StructuredData {
  title: string
  description: string
  sections: {
    label: string
    content: string
  }[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface AnalysisResult {
  structuredData: StructuredData
  faqData: FaqItem[]
  jsonLd: Record<string, unknown>
}

export interface ProductWithResults {
  id: string
  url: string
  title: string | null
  category: Category
  status: ProductStatus
  imageCount: number
  creditsUsed: number
  structuredData: StructuredData | null
  faqData: FaqItem[] | null
  jsonLd: Record<string, unknown> | null
  errorMessage: string | null
  createdAt: string
}

export const PLAN_CREDITS: Record<Plan, number> = {
  free: 3,
  starter: 30,
  growth: 100,
  pro: 300,
}

export const PLAN_PRICES: Record<Plan, number> = {
  free: 0,
  starter: 29000,
  growth: 79000,
  pro: 199000,
}

export const CATEGORY_LABELS: Record<Category, string> = {
  beauty: '뷰티·스킨케어',
  food: '식품·건강기능식품',
  clothing: '의류·패션',
  other: '기타',
}
