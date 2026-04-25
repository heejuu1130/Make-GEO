'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CATEGORY_LABELS, Category } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORIES: { value: Category; emoji: string }[] = [
  { value: 'beauty', emoji: '💄' },
  { value: 'food', emoji: '🥗' },
  { value: 'clothing', emoji: '👗' },
  { value: 'other', emoji: '📦' },
]

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState<Category>('beauty')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, category }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '분석 요청에 실패했습니다.')
        return
      }

      router.push(`/results/${data.productId}`)
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">상품 분석</h1>
      <p className="text-gray-500 mb-8">상품 URL을 입력하면 AI가 자동으로 GEO 최적화 데이터를 생성합니다.</p>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="url"
            label="상품 URL"
            type="url"
            placeholder="https://example.com/product"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all',
                    category === value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <span className="text-lg">{emoji}</span>
                  {CATEGORY_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {loading ? '분석 요청 중...' : '분석 시작하기'}
          </Button>
        </form>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>크레딧 안내</strong><br />
          분석 시 상품 이미지 수에 따라 크레딧이 차감됩니다. (기본 1개 + 이미지 5개당 1개 추가)
        </p>
      </div>
    </div>
  )
}
