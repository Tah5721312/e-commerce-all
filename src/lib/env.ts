/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Configuration for type-safe environment variables.
 * Imported through src/app/page.tsx
 * @see https://x.com/mattpocockuk/status/1760991147793449396
 */
import { z } from 'zod';

const envVariables = z.object({
  NEXT_PUBLIC_SHOW_LOGGER: z.enum(['true', 'false']).optional(),
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
});

// Only parse in production or when DATABASE_URL is provided
if (process.env.DATABASE_URL) {
  envVariables.parse(process.env);
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envVariables> { }
  }
}
