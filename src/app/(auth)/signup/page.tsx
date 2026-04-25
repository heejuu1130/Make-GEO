'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '회원가입에 실패했습니다.')
      setLoading(false)
      return
    }

    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (signInRes?.error) {
      router.push('/login')
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">회원가입</h1>
        <p className="text-sm text-gray-500 mb-6">무료로 시작하고 크레딧 3개를 받으세요</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="이름"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <Input
            id="email"
            label="이메일"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="비밀번호"
            type="password"
            placeholder="8자 이상 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            가입하기
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
