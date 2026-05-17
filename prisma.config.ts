// Prisma v7 config — URLs live here, not in schema.prisma
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses pgBouncer)
    // Use DATABASE_URL for runtime queries (pgBouncer pooled)
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'] ?? '',
  },
})
