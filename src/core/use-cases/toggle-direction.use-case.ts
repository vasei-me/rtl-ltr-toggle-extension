import { DirectionEntity } from "../entities/direction.entity";
import type { IDirectionRepository } from "../repositories/direction-repository.interface";

export class ToggleDirectionUseCase {
  constructor(private readonly repository: IDirectionRepository) {}

  async execute(configId: string): Promise<DirectionEntity> {
    const config = await this.repository.findById(configId);

    if (!config) {
      throw new Error("Configuration not found");
    }

    config.toggleDirection();
    await this.repository.save(config);

    return config;
  }
}
