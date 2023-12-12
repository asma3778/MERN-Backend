import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    defaultUserImagePath: process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.png',
    defaultProductsImagePath:
      process.env.DEFAULT_PRODUCTS_IMAGE_PATH || 'public/images/products/default.png',
    jwtUserActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY || 'aaaa',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || 'farah',
    jwtResetPasswordKey: process.env.JWT_REST_PASSWORD_KEY || 'shhhhh',
    stmpUsername: process.env.STMP_USERNAME || 'asmasaad3778@gmail.com',
    stmpPassword: process.env.STMP_PASSWORD || 'zskx btdw msij pflj',
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  },
  db: {
    url: process.env.MONGODB_URL || '',
  },
}
