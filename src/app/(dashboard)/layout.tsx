import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/dashboard/SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!session.user.onboarded) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-brand-700">Geoify</Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              크레딧{' '}
              <span className="font-semibold text-gray-900">{session.user.credits}</span>
            </div>
            <Link href="/analyze" className="btn-primary text-sm">
              + 분석하기
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
