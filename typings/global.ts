/* eslint-disable @typescript-eslint/no-namespace */
import { UserLoginPayload } from 'src/v1/auth';

declare global {
  type UUID = string;
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;

      PER_PAGE: string;
      PORT: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRE_TIME: string;
      JWT_REFRESH_TOKEN_EXPIRE_TIME: string;
      ROUND_SALT: string;
      FILE_MAX_COUNT: string;
      FILE_MAX_SIZE: string;

      DEV_DB_HOST: string;
      DEV_DB_PORT: string;
      DEV_DB_USER: string;
      DEV_DB_PASSWORD: string;
      DEV_DB_DATABASE: string;
      DEV_DB_TYPE: string;
      DEV_MAX_QUERY_EXECUTION_TIME: string;

      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_DOMAIN: string;
      AWS_S3_CERT_EXPIRE: string;
      AWS_S3_BUCKET_NAME: string;
    }
  }

  namespace Express {
    interface Request {
      id: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserLoginPayload {}
  }
}
