'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StructuredData, FaqItem } from '@/types'

interface ResultTabsProps {
  structuredData: StructuredData
  faqData: FaqItem[]
  jsonLd: Record<string, unknown>
}

type Tab = 'structured' | 'faq' | 'jsonld'

export function ResultTabs({ structuredData, faqData, jsonLd }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('structured')
  const [copied, setCopied] = useState(false)

  const jsonLdString = JSON.stringify(jsonLd, null, 2)

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'structured', label: '구조화 설명' },
    { key: 'faq', label: 'FAQ' },
    { key: 'jsonld', label: 'JSON-LD' },
  ]

  return (
    <div>
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === key
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 구조화 설명 탭 */}
      {activeTab === 'structured' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">제목</div>
            <div className="text-lg font-bold text-gray-900">{structuredData.title}</div>
          </div>
          <div className="card p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">설명</div>
            <p className="text-gray-700 text-sm leading-relaxed">{structuredData.description}</p>
          </div>
          {structuredData.sections.map((section, i) => (
            <div key={i} className="card p-5">
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
                {section.label}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
          <button
            onClick={() => handleCopy(`${structuredData.title}\n\n${structuredData.description}\n\n${structuredData.sections.map((s) => `${s.label}\n${s.content}`).join('\n\n')}`)}
            className="btn-secondary text-sm"
          >
            {copied ? '복사됨 ✓' : '전체 텍스트 복사'}
          </button>
        </div>
      )}

      {/* FAQ 탭 */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqData.map((item, i) => (
            <details key={i} className="card p-5 group">
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Q. {item.question}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </details>
          ))}
          <button
            onClick={() => handleCopy(faqData.map((f) => `Q. ${f.question}\nA. ${f.answer}`).join('\n\n'))}
            className="btn-secondary text-sm"
          >
            {copied ? '복사됨 ✓' : 'FAQ 전체 복사'}
          </button>
        </div>
      )}

      {/* JSON-LD 탭 */}
      {activeTab === 'jsonld' && (
        <div>
          <div className="bg-gray-900 rounded-xl p-5 overflow-auto max-h-[500px]">
            <pre className="text-sm text-green-400 font-mono whitespace-pre">{jsonLdString}</pre>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleCopy(`<script type="application/ld+json">\n${jsonLdString}\n</script>`)}
              className="btn-secondary text-sm"
            >
              {copied ? '복사됨 ✓' : 'HTML script 태그로 복사'}
            </button>
            <button
              onClick={() => handleCopy(jsonLdString)}
              className="btn-secondary text-sm"
            >
              JSON만 복사
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            이 JSON-LD 코드를 상품 페이지 &lt;head&gt; 안에 삽입하면 AI 검색엔진이 상품 정보를 정확히 파악합니다.
          </p>
        </div>
      )}
    </div>
  )
}
