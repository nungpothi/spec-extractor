import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SpecAnalysis } from './entities/SpecAnalysis';
import { loadEnv } from '../utils/env';

let appDataSource: DataSource | null = null;

export async function getAppDataSource(): Promise<DataSource> {
  if (appDataSource && appDataSource.isInitialized) return appDataSource;

  const env = loadEnv();

  appDataSource = new DataSource({
    type: 'postgres',
    host: env.DB_HOST,
    port: Number(env.DB_PORT || 5432),
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [SpecAnalysis],
    synchronize: true, // For demo; replace with migrations in production
    logging: false,
  });

  await appDataSource.initialize();
  const ts = new Date().toISOString();
  console.log(`[${ts}] Database connected: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  return appDataSource;
}

