import { z } from 'zod'

// ─── Auth schemas ────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ─── Note schemas ────────────────────────────────────────────────────────────

export const noteCreateSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
})

export const noteUpdateSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isArchived: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  aiSummary: z.string().optional(),
  aiItems: z.array(z.string()).optional(),
  aiTitle: z.string().max(200).optional(),
})

export const aiGenerateSchema = z.object({
  type: z.enum(['summary', 'actions', 'title']),
})

// ─── Inferred types ──────────────────────────────────────────────────────────

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type NoteCreateInput = z.infer<typeof noteCreateSchema>
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>
export type AIGenerateInput = z.infer<typeof aiGenerateSchema>
