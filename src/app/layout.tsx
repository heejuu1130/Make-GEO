import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Geoify – AI 검색 최적화 솔루션',
  description: '상품 URL 하나로 AI 검색엔진 최적화 구조 데이터를 자동 생성하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
