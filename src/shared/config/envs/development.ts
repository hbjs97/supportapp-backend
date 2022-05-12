export const config = {
  db: {
    type: process.env.DEV_DB_TYPE,
    synchronize: false,
    logging: true,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    maxQueryExecutionTime: process.env.DEV_MAX_QUERY_EXECUTION_TIME,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
    entities: [`${__dirname}/../../entities/**/*.entity.{js,ts}`],
  },
};
