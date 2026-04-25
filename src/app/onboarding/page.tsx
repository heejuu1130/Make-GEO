'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Category, CATEGORY_LABELS } from '@/types'

const CATEGORIES: { value: Category; emoji: string; desc: string }[] = [
  { value: 'beauty', emoji: '💄', desc: '스킨케어, 화장품, 헤어케어 등' },
  { value: 'food', emoji: '🥗', desc: '식품, 건강기능식품, 영양제 등' },
  { value: 'clothing', emoji: '👗', desc: '의류, 신발, 액세서리 등' },
  { value: 'other', emoji: '📦', desc: '가전, 생활용품, 기타 상품 등' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)

    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: selected }),
    })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-brand-700 mb-2">Geoify</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">주요 판매 카테고리를 선택해주세요</h1>
          <p className="text-sm text-gray-500">카테고리에 맞는 전문 프롬프트로 더 정확하게 분석합니다</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {CATEGORIES.map(({ value, emoji, desc }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={cn(
                'card p-5 text-left transition-all',
                selected === value
                  ? 'ring-2 ring-brand-500 bg-brand-50'
                  : 'hover:border-brand-300'
              )}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="font-semibold text-sm text-gray-900">{CATEGORY_LABELS[value]}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!selected}
          loading={loading}
          onClick={handleSubmit}
        >
          시작하기 →
        </Button>

        <p className="mt-3 text-center text-xs text-gray-400">
          나중에 설정에서 변경할 수 있습니다
        </p>
      </div>
    </div>
  )
}
