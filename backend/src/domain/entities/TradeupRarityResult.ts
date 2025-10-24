import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TradeupCalculation } from './TradeupCalculation';

@Entity('tradeup_rarity_results')
export class TradeupRarityResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tradeup_id!: string;

  @ManyToOne(() => TradeupCalculation, calculation => calculation.rarity_results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tradeup_id' })
  tradeup!: TradeupCalculation;

  @Column({ type: 'varchar', length: 100 })
  rarity!: string;

  @Column({ type: 'int' })
  count!: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  max_price!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  // Domain logic methods
  public isAffordable(budget: number): boolean {
    return (this.max_price * this.count) <= budget;
  }

  public getTotalCost(): number {
    return this.max_price * this.count;
  }

  public getFormattedMaxPrice(): string {
    return this.max_price.toFixed(3);
  }

  public static createResult(
    tradeupId: string, 
    rarity: string, 
    count: number, 
    maxPrice: number,
    userId?: string
  ): TradeupRarityResult {
    const result = new TradeupRarityResult();
    result.tradeup_id = tradeupId;
    result.rarity = rarity;
    result.count = count;
    result.max_price = maxPrice;
    result.created_by = userId;
    return result;
  }
}