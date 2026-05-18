interface Env {
  NODE_ENV: string
  AUTH: {
    SECRET: string
    URL: string
    DOMAIN: string
  }
  DB: {
    URL: string
  }
  CORS: {
    ORIGIN_ADMIN: string
    ORIGIN_CLIENT: string
  }
  EMAIL: {
    RESEND_API_KEY: string
    FROM: string
  }
  ADMIN: {
    EMAIL: string
    PASSWORD: string
  }
}

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH: {
    SECRET: process.env.BETTER_AUTH_SECRET!,
    URL: process.env.BETTER_AUTH_URL!,
    DOMAIN: process.env.DOMAIN!,
  },
  DB: {
    URL: process.env.DATABASE_URL!,
  },
  CORS: {
    ORIGIN_ADMIN: process.env.ORIGIN_ADMIN!,
    ORIGIN_CLIENT: process.env.ORIGIN_CLIENT!,
  },
  EMAIL: {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    FROM: process.env.EMAIL_FROM!,
  },
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL!,
    PASSWORD: process.env.ADMIN_PASSWORD!,
  },
}
