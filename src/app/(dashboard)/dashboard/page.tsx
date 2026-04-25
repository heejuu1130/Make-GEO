import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductList } from '@/components/dashboard/ProductList'

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-0.5">분석된 상품 목록을 확인하세요</p>
        </div>
        <Link href="/analyze">
          <Button>+ 새 분석</Button>
        </Link>
      </div>
      <ProductList />
    </div>
  )
}
