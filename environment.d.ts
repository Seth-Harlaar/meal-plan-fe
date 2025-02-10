// declaring env variables for intellisense

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string,
      DB_USER: string,
      DB_PASS: string,
      DB_NAME: string,

      GOOGLE_CLIENT_ID: string,
      GOOGLE_SECRET: string,

      JWT_SECRET: string,
    }
  }
}

export {}