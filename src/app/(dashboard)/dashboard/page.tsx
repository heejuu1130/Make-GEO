import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductList } from '@/components/dashboard/ProductList'
import { CATEGORY_LABELS, Category } from '@/types'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user.name ? `${user.name}님, ` : ''}안녕하세요! 카테고리:{' '}
            <span className="font-medium text-gray-700">
              {CATEGORY_LABELS[user.category as Category] ?? '미설정'}
            </span>
          </p>
        </div>
        <Link href="/analyze">
          <Button>+ 새 분석</Button>
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">남은 크레딧</div>
          <div className="text-3xl font-bold text-brand-600">{user.credits}</div>
          <div className="text-xs text-gray-400 mt-1">플랜: {user.plan}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">카테고리</div>
          <div className="text-xl font-bold text-gray-900">
            {CATEGORY_LABELS[user.category as Category] ?? '미설정'}
          </div>
          <div className="text-xs text-gray-400 mt-1">분석 전문 프롬프트 적용</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">빠른 분석</div>
          <Link href="/analyze">
            <Button className="mt-1 w-full" size="sm">URL 붙여넣기 →</Button>
          </Link>
        </div>
      </div>

      {/* 상품 목록 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">분석 목록</h2>
        <ProductList />
      </div>
    </div>
  )
}
