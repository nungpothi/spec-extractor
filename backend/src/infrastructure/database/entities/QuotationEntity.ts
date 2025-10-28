import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { QuotationItemEntity } from './QuotationItemEntity';

const decimalTransformer = {
  to: (value: number): number => value,
  from: (value: string | null): number => {
    if (value === null || value === undefined) {
      return 0;
    }
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  },
};

@Entity('quotations')
export class QuotationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 255, name: 'company_name' })
  companyName!: string;

  @Column({ type: 'varchar', length: 255, name: 'client_name' })
  clientName!: string;

  @Column({ type: 'text', name: 'note', nullable: true })
  note?: string | null;

  @Column({ type: 'boolean', name: 'include_vat', default: true })
  includeVat!: boolean;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 4,
    name: 'vat_rate',
    default: 0.07,
    transformer: decimalTransformer,
  })
  vatRate!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'subtotal',
    default: 0,
    transformer: decimalTransformer,
  })
  subtotal!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'vat_amount',
    default: 0,
    transformer: decimalTransformer,
  })
  vatAmount!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'total',
    default: 0,
    transformer: decimalTransformer,
  })
  total!: number;

  @Column({ type: 'uuid', name: 'share_id', nullable: true })
  shareId?: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToMany(() => QuotationItemEntity, (item) => item.quotation, {
    cascade: true,
    eager: true,
  })
  items!: QuotationItemEntity[];
}
