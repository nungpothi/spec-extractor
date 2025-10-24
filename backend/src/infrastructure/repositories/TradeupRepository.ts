import { Repository, DataSource } from 'typeorm';
import { TradeupCalculation } from '../../domain/entities/TradeupCalculation';
import { TradeupRarityResult } from '../../domain/entities/TradeupRarityResult';
import { ITradeupRepository } from '../../domain/repositories/ITradeupRepository';

export class TradeupRepository implements ITradeupRepository {
  private calculationRepo: Repository<TradeupCalculation>;
  private resultRepo: Repository<TradeupRarityResult>;

  constructor(private dataSource: DataSource) {
    this.calculationRepo = dataSource.getRepository(TradeupCalculation);
    this.resultRepo = dataSource.getRepository(TradeupRarityResult);
  }

  async findAll(): Promise<TradeupCalculation[]> {
    return this.calculationRepo.find({
      relations: ['rarity_results'],
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: string): Promise<TradeupCalculation | null> {
    return this.calculationRepo.findOne({
      where: { id },
      relations: ['rarity_results']
    });
  }

  async create(calculationData: Partial<TradeupCalculation>): Promise<TradeupCalculation> {
    return this.dataSource.transaction(async (manager) => {
      const calculationRepo = manager.getRepository(TradeupCalculation);
      const resultRepo = manager.getRepository(TradeupRarityResult);

      // Create the calculation
      const calculation = calculationRepo.create(calculationData);
      const savedCalculation = await calculationRepo.save(calculation);

      // Calculate and save rarity results
      const rarityResults = savedCalculation.calculateTradeupResults();
      const savedResults = await resultRepo.save(
        rarityResults.map(result => ({
          ...result,
          tradeup_id: savedCalculation.id,
          created_by: calculationData.created_by
        }))
      );

      savedCalculation.rarity_results = savedResults;
      return savedCalculation;
    });
  }

  async findRecent(limit: number): Promise<TradeupCalculation[]> {
    return this.calculationRepo.find({
      relations: ['rarity_results'],
      order: { created_at: 'DESC' },
      take: limit
    });
  }

  async findByKnifePrice(knifePrice: number): Promise<TradeupCalculation[]> {
    return this.calculationRepo.find({
      where: { knife_price: knifePrice },
      relations: ['rarity_results'],
      order: { created_at: 'DESC' }
    });
  }
}