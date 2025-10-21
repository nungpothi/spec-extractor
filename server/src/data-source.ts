import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConversationHistory } from './entities/ConversationHistory';

dotenv.config();

const synchronize = process.env.TYPEORM_SYNCHRONIZE
  ? process.env.TYPEORM_SYNCHRONIZE === 'true'
  : process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize,
  logging: false,
  entities: [ConversationHistory],
});

export async function initializeDataSource(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  const options = AppDataSource.options as PostgresConnectionOptions;
  if (!options.url) {
    throw new Error('DATABASE_URL environment variable is required to start the server');
  }

  return AppDataSource.initialize();
}
