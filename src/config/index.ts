import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT),
    defaultUserImagePath: String(process.env.DEFAULT_USER_IMAGE_PATH) ,
    defaultProductsImagePath:
    String(process.env.DEFAULT_PRODUCTS_IMAGE_PATH),
    jwtUserActivationKey: String(process.env.JWT_ACCOUNT_ACTIVATION_KEY) ,
    jwtAccessKey: String(process.env.JWT_ACCESS_KEY),
    jwtResetPasswordKey: String(process.env.JWT_REST_PASSWORD_KEY),
    stmpUsername: String(process.env.STMP_USERNAME),
    stmpPassword: String(process.env.STMP_PASSWORD),
    JWT_SECRET: String(process.env.JWT_SECRET),
  },
  db: {
    url: String(process.env.MONGODB_URL),
  },
}
