export const config = {
  perPage: process.env.PER_PAGE,
  port: process.env.PORT,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  jwtRefreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
  roundSalt: process.env.ROUND_SALT,
  fileMaxCount: process.env.FILE_MAX_COUNT,
  fileMaxSize: process.env.FILE_MAX_SIZE,

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

    s3: {
      domain: process.env.AWS_S3_DOMAIN,
      certExpire: process.env.AWS_S3_CERT_EXPIRE,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  },
};
