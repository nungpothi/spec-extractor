import { DataSource } from 'typeorm';
import { Template } from '../../domain/entities/Template';
import { TemplateLog } from '../../domain/entities/TemplateLog';
import { TradeupCalculation } from '../../domain/entities/TradeupCalculation';
import { TradeupRarityResult } from '../../domain/entities/TradeupRarityResult';
import dotenv from "dotenv";

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'template_management',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Template, TemplateLog, TradeupCalculation, TradeupRarityResult],
  migrations: ['src/infrastructure/migrations/*.ts'],
  subscribers: ['src/infrastructure/subscribers/*.ts'],
});
