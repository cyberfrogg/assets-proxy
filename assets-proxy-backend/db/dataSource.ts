import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema: 'public',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['src/migrations/*.js'],
  migrationsTransactionMode: 'each',
  poolSize: 10,
};

export default new DataSource(dataSourceOptions);
