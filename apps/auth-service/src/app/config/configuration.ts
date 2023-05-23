export default () => ({
  authMongoUrl: process.env.AUTH_MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
});
