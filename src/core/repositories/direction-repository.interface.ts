import { DirectionEntity } from "../entities/direction.entity";

export interface IDirectionRepository {
  save(config: DirectionEntity): Promise<void>;
  findById(id: string): Promise<DirectionEntity | null>;
  findAll(): Promise<DirectionEntity[]>;
  delete(id: string): Promise<void>;
  findByUrl(url: string): Promise<DirectionEntity | null>;
  clearAll(): Promise<void>;
}
