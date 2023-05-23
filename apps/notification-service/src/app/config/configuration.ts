export default () => ({
  notificationMongoUrl: process.env.NOTIFICATION_MONGO_URL,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: process.env.MAILTRAP_PORT,
  mailtrapAuthUser: process.env.MAILTRAP_AUTH_USER,
  mailtrapAuthPass: process.env.MAILTRAP_AUTH_PASS,
});
