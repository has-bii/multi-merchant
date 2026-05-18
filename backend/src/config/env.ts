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
    ORIGIN_ADMIN: process.env.CORS_ORIGIN_ADMIN!,
    ORIGIN_CLIENT: process.env.CORS_ORIGIN_CLIENT!,
  },
}
