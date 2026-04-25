import { Category } from '@/types'
import { beautySystemPrompt } from './beauty'
import { foodSystemPrompt } from './food'
import { clothingSystemPrompt } from './clothing'

const otherSystemPrompt = beautySystemPrompt.replace(
  '뷰티·스킨케어',
  '이커머스'
).replace(
  '성분, 사용법, 피부 타입',
  '제품 특징, 사용 방법, 주요 정보'
)

export function getSystemPrompt(category: Category): string {
  switch (category) {
    case 'beauty':   return beautySystemPrompt
    case 'food':     return foodSystemPrompt
    case 'clothing': return clothingSystemPrompt
    default:         return otherSystemPrompt
  }
}
