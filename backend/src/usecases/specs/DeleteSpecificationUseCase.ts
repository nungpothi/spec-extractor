import { ISpecificationRepository } from '../../domain';

export class DeleteSpecificationUseCase {
  constructor(
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Check if specification exists
    const specification = await this.specificationRepository.findById(id);
    
    if (!specification) {
      throw new Error('Specification not found');
    }

    // Delete the specification
    await this.specificationRepository.delete(id);
  }
}