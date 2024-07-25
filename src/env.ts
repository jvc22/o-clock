import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)
