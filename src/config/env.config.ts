interface EnvConfig {
  environment: string
  mongodb: string | undefined
  port: string | number
  defaultLimit: string | number
}

export const EnvConfiguration: () => EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: +(process.env.DEFAULT_LIMIT ?? 7),
})
