import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PromptCompileResult } from '../types';

@Entity({ name: 'conversation_history' })
export class ConversationHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 64 })
  sessionId!: string;

  @Column({ type: 'text' })
  userInput!: string;

  @Column({ type: 'jsonb', nullable: true })
  aiResponse!: PromptCompileResult | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
