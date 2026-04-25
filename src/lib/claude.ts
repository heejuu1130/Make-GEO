import { GoogleGenerativeAI } from '@google/generative-ai'
import { Category, AnalysisResult } from '@/types'
import { getSystemPrompt } from './prompts'

function getClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
}

export async function analyzeProduct(
  markdown: string,
  category: Category,
  productUrl: string
): Promise<AnalysisResult> {
  const systemPrompt = getSystemPrompt(category)

  const userMessage = `다음 상품 페이지를 분석해주세요.

상품 URL: ${productUrl}

상품 페이지 내용:
${markdown.slice(0, 8000)}`

  const model = getClient().getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const result = await model.generateContent(userMessage)
  const text = result.response.text()

  let parsed: {
    structuredData: AnalysisResult['structuredData']
    faqData: AnalysisResult['faqData']
    jsonLd: AnalysisResult['jsonLd']
  }

  try {
    const jsonText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('AI 응답 파싱 오류. 다시 시도해주세요.')
  }

  const faqJsonLd = {
    ...parsed.jsonLd,
    mainEntityOfPage: {
      '@type': 'FAQPage',
      mainEntity: parsed.faqData.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  }

  return {
    structuredData: parsed.structuredData,
    faqData: parsed.faqData,
    jsonLd: faqJsonLd,
  }
}
