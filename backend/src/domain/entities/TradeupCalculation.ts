import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { TradeupRarityResult } from './TradeupRarityResult';

@Entity('tradeup_calculations')
export class TradeupCalculation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  knife_price!: number;

  @Column({ type: 'jsonb' })
  result_json!: object;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  @OneToMany(() => TradeupRarityResult, result => result.tradeup)
  rarity_results!: TradeupRarityResult[];

  // Domain logic methods
  public isValidKnifePrice(): boolean {
    return this.knife_price > 0;
  }

  public calculateTradeupResults(): TradeupRarityResult[] {
    const rarities = [
      { name: 'Covert (แดง)', multiplier: 1 },
      { name: 'Classified (ชมพู)', multiplier: 10 },
      { name: 'Restricted (ม่วง)', multiplier: 100 },
      { name: 'Mil-Spec (น้ำเงิน)', multiplier: 1000 },
      { name: 'Industrial (ฟ้าอ่อน)', multiplier: 10000 }
    ];

    return rarities.map(rarity => {
      const count = 5 * rarity.multiplier;
      const maxPrice = this.knife_price / count;
      
      const result = new TradeupRarityResult();
      result.rarity = rarity.name;
      result.count = count;
      result.max_price = maxPrice;
      result.tradeup_id = this.id;
      
      return result;
    });
  }

  public updateCalculation(knifePrice: number): void {
    if (knifePrice <= 0) {
      throw new Error('Knife price must be greater than 0');
    }
    this.knife_price = knifePrice;
    
    const results = this.calculateTradeupResults();
    this.result_json = {
      knifePrice,
      results: results.map(r => ({
        rarity: r.rarity,
        count: r.count,
        maxPrice: r.max_price
      }))
    };
  }
}