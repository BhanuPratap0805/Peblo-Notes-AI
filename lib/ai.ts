import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize AI providers
const geminiApiKey = process.env.GEMINI_API_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

// ─── Prompt templates ────────────────────────────────────────────────────────

function buildPrompt(type: 'summary' | 'actions' | 'title', content: string): string {
  const prompts = {
    summary: `SYSTEM: You are a professional editor. Summarize the user's note provided below in exactly 2-3 concise sentences. Focus on the most important facts. Do not repeat the note verbatim. Do not start with "This note".
    
NOTE CONTENT:
"${content}"

SUMMARY:`,
    actions: `SYSTEM: Extract a list of action items or checklist tasks from the note below. Return ONLY a valid JSON array of strings. Do not include markdown code blocks. Do not include any other text.
    
NOTE CONTENT:
"${content}"

JSON ARRAY:`,
    title: `SYSTEM: Suggest a short, punchy title (max 5 words) for the note below. Return ONLY the title text. No quotes. No preamble.
    
NOTE CONTENT:
"${content}"

TITLE:`,
  }
  return prompts[type]
}

// ─── Streaming response ───────────────────────────────────────────────────────

export async function streamAIResponse(
  type: 'summary' | 'actions' | 'title',
  content: string
): Promise<ReadableStream<Uint8Array>> {
  // 1. Try Gemini first if configured
  if (genAI) {
    // Try multiple model identifiers in case one is restricted or 404
    const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    let lastError: Error | null = null

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const prompt = buildPrompt(type, content)
        const result = await model.generateContentStream(prompt)

        return new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.stream) {
                const text = chunk.text()
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text))
                }
              }
            } catch (streamError) {
              console.error(`Stream error with ${modelName}:`, streamError)
            } finally {
              controller.close()
            }
          },
        })
      } catch (error) {
        console.warn(`Model ${modelName} failed, trying next...`, error)
        lastError = error as Error
        continue
      }
    }

    if (lastError) {
      throw new Error(`Gemini failed all models. Last error: ${lastError.message}`)
    }
  }

  // 2. Fallback to OpenAI if configured
  if (openai) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      max_tokens: 400,
      messages: [{ role: 'user', content: buildPrompt(type, content) }],
    })

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      },
    })
  }

  throw new Error('No AI provider configured. Please check your .env file.')
}
