import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuotationEntity } from './QuotationEntity';

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

@Entity('quotation_items')
export class QuotationItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'quotation_id' })
  quotationId!: string;

  @Column({ type: 'varchar', length: 255, name: 'name_th' })
  nameTh!: string;

  @Column({ type: 'varchar', length: 255, name: 'name_en', nullable: true })
  nameEn?: string | null;

  @Column({ type: 'int', name: 'qty', default: 1 })
  qty!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'unit_price',
    default: 0,
    transformer: decimalTransformer,
  })
  unitPrice!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'total',
    default: 0,
    transformer: decimalTransformer,
  })
  total!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => QuotationEntity, (quotation) => quotation.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quotation_id' })
  quotation!: QuotationEntity;
}
