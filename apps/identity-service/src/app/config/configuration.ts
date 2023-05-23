export default () => ({
  identityMongoUrl: process.env.IDENTITY_MONGO_URL,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  mailtrapHost: process.env.MAIL_TRAP_HOST,
  mailtrapPort: process.env.MAILTRAP_PORT,
  mailtrapAuthUser: process.env.MAILTRAP_AUTH_USER,
  mailtrapAuthPass: process.env.MAILTRAP_AUTH_PASS
});
