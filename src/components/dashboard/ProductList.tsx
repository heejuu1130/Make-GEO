'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { CATEGORY_LABELS, Category, ProductStatus } from '@/types'
import { formatDate } from '@/lib/utils'

interface Product {
  id: string
  url: string
  title: string | null
  category: Category
  status: ProductStatus
  imageCount: number
  creditsUsed: number
  errorMessage: string | null
  createdAt: string
}

const STATUS_BADGE: Record<ProductStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  done: { label: '완료', variant: 'success' },
  analyzing: { label: '분석 중', variant: 'info' },
  pending: { label: '대기 중', variant: 'default' },
  error: { label: '오류', variant: 'error' },
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 분석 중인 상품이 있으면 폴링
  useEffect(() => {
    const hasAnalyzing = products.some((p) => p.status === 'analyzing' || p.status === 'pending')
    if (!hasAnalyzing) return

    const interval = setInterval(fetchProducts, 3000)
    return () => clearInterval(interval)
  }, [products, fetchProducts])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="font-semibold text-gray-900 mb-1">분석된 상품이 없습니다</h3>
        <p className="text-sm text-gray-500 mb-6">상품 URL을 입력하여 첫 번째 GEO 분석을 시작하세요.</p>
        <Link href="/analyze" className="btn-primary text-sm">
          첫 상품 분석하기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const { label, variant } = STATUS_BADGE[product.status]
        return (
          <Link
            key={product.id}
            href={product.status === 'done' ? `/results/${product.id}` : '#'}
            className={`card p-5 flex items-center gap-4 group transition-all ${product.status === 'done' ? 'hover:border-brand-300 cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={variant}>{label}</Badge>
                <span className="text-xs text-gray-400">{CATEGORY_LABELS[product.category]}</span>
              </div>
              <div className="font-medium text-gray-900 truncate">
                {product.title || product.url}
              </div>
              {product.title && (
                <div className="text-xs text-gray-400 truncate mt-0.5">{product.url}</div>
              )}
              {product.errorMessage && (
                <div className="text-xs text-red-500 mt-1">{product.errorMessage}</div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-400">{formatDate(product.createdAt)}</div>
              {product.status === 'done' && (
                <div className="text-xs text-gray-400 mt-0.5">크레딧 {product.creditsUsed}개 사용</div>
              )}
              {(product.status === 'analyzing' || product.status === 'pending') && (
                <Spinner className="mt-1 ml-auto h-4 w-4" />
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
