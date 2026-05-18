interface Env {
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
  ADMIN: {
    EMAIL: string
    PASSWORD: string
  }
}

export const env: Env = {
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
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL!,
    PASSWORD: process.env.ADMIN_PASSWORD!,
  },
}
