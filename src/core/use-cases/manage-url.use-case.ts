import { DirectionEntity } from "../entities/direction.entity";
import type { IDirectionRepository } from "../repositories/direction-repository.interface";

export class ManageUrlUseCase {
  constructor(private readonly repository: IDirectionRepository) {}

  async addUrl(configId: string, url: string): Promise<DirectionEntity> {
    const config = await this.repository.findById(configId);

    if (!config) {
      throw new Error("Configuration not found");
    }

    config.addTargetUrl(url);
    await this.repository.save(config);

    return config;
  }

  async removeUrl(configId: string, url: string): Promise<DirectionEntity> {
    const config = await this.repository.findById(configId);

    if (!config) {
      throw new Error("Configuration not found");
    }

    config.removeTargetUrl(url);
    await this.repository.save(config);

    return config;
  }

  async toggleEnabled(configId: string): Promise<DirectionEntity> {
    const config = await this.repository.findById(configId);

    if (!config) {
      throw new Error("Configuration not found");
    }

    config.toggleEnabled();
    await this.repository.save(config);

    return config;
  }
}
