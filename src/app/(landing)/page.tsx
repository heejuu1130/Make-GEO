import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">Geoify</span>
          <Link href="/analyze">
            <Button size="sm">바로 시작하기</Button>
          </Link>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
          AI 검색엔진 최적화
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          상품 URL 하나로<br />
          <span className="text-brand-600">AI 검색 최적화</span> 끝
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          ChatGPT, Perplexity, Claude 같은 AI 검색엔진이 내 상품을 정확히 이해하도록,<br />
          구조화 데이터·FAQ·JSON-LD를 자동으로 생성해드립니다.
        </p>
        <Link href="/analyze">
          <Button size="lg">무료로 시작하기 →</Button>
        </Link>
        <p className="mt-4 text-sm text-gray-400">가입 없이 바로 사용 가능</p>
      </section>

      {/* 작동 방식 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">3단계로 완성되는 GEO</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'URL 입력', desc: '분석할 상품 페이지 URL을 붙여넣으세요. 쿠팡·네이버·스마트스토어 모두 지원합니다.' },
              { step: '02', title: 'AI 분석', desc: 'Firecrawl로 페이지를 크롤링하고 Gemini AI가 카테고리별 맞춤 분석을 수행합니다.' },
              { step: '03', title: '구조 데이터 생성', desc: 'AI 검색엔진 최적화된 설명, FAQ, JSON-LD 스키마를 즉시 복사하세요.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-brand-200 mb-3">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">지원 카테고리</h2>
          <p className="text-center text-gray-500 mb-12">카테고리별 전문 프롬프트로 더 정확한 분석을 제공합니다.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { emoji: '💄', label: '뷰티·스킨케어', desc: '성분, 효능, 피부 타입별 분석' },
              { emoji: '🥗', label: '식품·건강기능식품', desc: '영양성분, 알레르기, 인증 분석' },
              { emoji: '👗', label: '의류·패션', desc: '소재, 사이즈, 케어 방법 분석' },
              { emoji: '📦', label: '기타 e커머스', desc: '범용 상품 구조 데이터 생성' },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="card p-5 text-center">
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{label}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">지금 바로 시작해보세요</h2>
        <p className="text-gray-500 mb-8">가입 없이 상품 URL만 입력하면 바로 AI 검색 최적화 데이터를 받을 수 있습니다.</p>
        <Link href="/analyze">
          <Button size="lg">분석 시작하기 →</Button>
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2025 Geoify. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
