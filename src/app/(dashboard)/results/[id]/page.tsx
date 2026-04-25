'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { ResultTabs } from '@/components/analysis/ResultTabs'
import { ProductWithResults } from '@/types'
import { formatDate } from '@/lib/utils'
import { CATEGORY_LABELS, Category } from '@/types'

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<ProductWithResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) {
        router.push('/dashboard')
        return
      }
      const data: ProductWithResults = await res.json()
      setProduct(data)
      setLoading(false)

      if (data.status === 'done' || data.status === 'error') {
        clearInterval(interval)
      }
    }

    fetchProduct()
    interval = setInterval(fetchProduct, 3000)
    return () => clearInterval(interval)
  }, [id, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    )
  }

  if (!product) return null

  const isAnalyzing = product.status === 'analyzing' || product.status === 'pending'

  return (
    <div className="max-w-3xl mx-auto">
      {/* 뒤로가기 */}
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-6">
        ← 대시보드로
      </Link>

      {/* 상품 헤더 */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={
                product.status === 'done' ? 'success' :
                product.status === 'error' ? 'error' : 'info'
              }>
                {product.status === 'done' ? '완료' : product.status === 'error' ? '오류' : '분석 중'}
              </Badge>
              <span className="text-xs text-gray-400">
                {CATEGORY_LABELS[product.category as Category]}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {product.title || product.url}
            </h1>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:underline truncate block"
            >
              {product.url}
            </a>
          </div>
          {product.status === 'done' && (
            <div className="text-right shrink-0 text-xs text-gray-400">
              <div>{formatDate(product.createdAt)}</div>
              <div className="mt-0.5">크레딧 {product.creditsUsed}개 사용</div>
            </div>
          )}
        </div>
      </div>

      {/* 분석 중 상태 */}
      {isAnalyzing && (
        <div className="card p-10 text-center">
          <Spinner className="h-10 w-10 mx-auto mb-4" />
          <h2 className="font-semibold text-gray-900 mb-2">AI가 분석 중입니다</h2>
          <p className="text-sm text-gray-500">
            상품 페이지를 크롤링하고 Claude AI로 구조화 데이터를 생성하고 있어요.<br />
            보통 30초~2분 정도 소요됩니다.
          </p>
        </div>
      )}

      {/* 오류 상태 */}
      {product.status === 'error' && (
        <div className="card p-6 border-red-200 bg-red-50">
          <h2 className="font-semibold text-red-700 mb-2">분석 실패</h2>
          <p className="text-sm text-red-600 mb-4">{product.errorMessage}</p>
          <Link href="/analyze" className="btn-primary text-sm">
            다시 시도하기
          </Link>
        </div>
      )}

      {/* 완료 상태: 결과 탭 */}
      {product.status === 'done' && product.structuredData && product.faqData && product.jsonLd && (
        <ResultTabs
          structuredData={product.structuredData}
          faqData={product.faqData}
          jsonLd={product.jsonLd}
        />
      )}
    </div>
  )
}
