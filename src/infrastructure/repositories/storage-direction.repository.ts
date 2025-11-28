// Add type declaration for 'browser' to support WebExtension API
declare const browser: typeof import("webextension-polyfill");

import { Storage } from "@plasmohq/storage"; // <-- Plasmo's Storage API
import {
  type DirectionConfig,
  DirectionEntity,
} from "../../core/entities/direction.entity";
import type { IDirectionRepository } from "../../core/repositories/direction-repository.interface";

export class StorageDirectionRepository implements IDirectionRepository {
  private readonly STORAGE_KEY = "direction-configs";
  private readonly storage: Storage; // <-- Use Plasmo's Storage instance

  constructor() {
    // Initialize Plasmo's storage. It's the preferred method.
    this.storage = new Storage();
  }

  async save(config: DirectionEntity): Promise<void> {
    const configs = await this.getAllConfigs();
    const existingIndex = configs.findIndex((c) => c.id === config.id);

    if (existingIndex >= 0) {
      configs[existingIndex] = this.entityToConfig(config);
    } else {
      configs.push(this.entityToConfig(config));
    }

    await this.saveAllConfigs(configs);
  }

  async findById(id: string): Promise<DirectionEntity | null> {
    const configs = await this.getAllConfigs();
    const config = configs.find((c) => c.id === id);

    return config ? this.configToEntity(config) : null;
  }

  async findAll(): Promise<DirectionEntity[]> {
    const configs = await this.getAllConfigs();
    return configs.map((config) => this.configToEntity(config));
  }

  async delete(id: string): Promise<void> {
    const configs = await this.getAllConfigs();
    const filteredConfigs = configs.filter((c) => c.id !== id);
    await this.saveAllConfigs(filteredConfigs);
  }

  async findByUrl(url: string): Promise<DirectionEntity | null> {
    const configs = await this.getAllConfigs();
    const config = configs.find(
      (c) =>
        c.enabled && c.targetUrls.some((targetUrl) => url.includes(targetUrl))
    );
    return config ? this.configToEntity(config) : null;
  }

  async clearAll(): Promise<void> {
    try {
      // Use Plasmo's storage as the primary method
      await this.storage.set(this.STORAGE_KEY, []);
      return;
    } catch (err) {
      console.warn(
        "Clearing configs with Plasmo storage failed, falling back:",
        err
      );
      // Fallback to the original logic if Plasmo's fails for any reason
      await this.fallbackClearAll();
    }
  }

  private async getAllConfigs(): Promise<DirectionConfig[]> {
    try {
      // Use Plasmo's storage as the primary method
      const result = await this.storage.get<DirectionConfig[]>(
        this.STORAGE_KEY
      );
      return result || [];
    } catch (err) {
      console.warn(
        "Getting configs with Plasmo storage failed, falling back:",
        err
      );
      // Fallback to the original logic if Plasmo's fails for any reason
      return await this.fallbackGetAllConfigs();
    }
  }

  private async saveAllConfigs(configs: DirectionConfig[]): Promise<void> {
    try {
      // Use Plasmo's storage as the primary method
      await this.storage.set(this.STORAGE_KEY, configs);
      return;
    } catch (err) {
      console.warn(
        "Saving configs with Plasmo storage failed, falling back:",
        err
      );
      // Fallback to the original logic if Plasmo's fails for any reason
      await this.fallbackSaveAllConfigs(configs);
    }
  }

  // --- Fallback methods (unchanged from your original code) ---

  private async fallbackClearAll(): Promise<void> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [this.STORAGE_KEY]: [] }, () => resolve());
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        await browser.storage.local.set({ [this.STORAGE_KEY]: [] } as any);
        return;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        return;
      }

      console.warn("No fallback storage available to clear configs");
      return;
    } catch (err) {
      console.warn("Fallback clearing configs failed:", err);
      return;
    }
  }

  private async fallbackGetAllConfigs(): Promise<DirectionConfig[]> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.get(
            [this.STORAGE_KEY],
            (result: Record<string, any>) => {
              resolve(result[this.STORAGE_KEY] || []);
            }
          );
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        console.log("Using browser.storage.local (fallback)");
        const result = await browser.storage.local.get(this.STORAGE_KEY as any);
        return result[this.STORAGE_KEY] || [];
      }

      if (typeof window !== "undefined" && window.localStorage) {
        console.log("Using window.localStorage (fallback)");
        const raw = window.localStorage.getItem(this.STORAGE_KEY);
        return raw ? (JSON.parse(raw) as DirectionConfig[]) : [];
      }

      console.log("No storage available (fallback)");
      return [];
    } catch (err) {
      console.warn(
        "Fallback storage access failed, returning empty configs:",
        err
      );
      return [];
    }
  }

  private async fallbackSaveAllConfigs(
    configs: DirectionConfig[]
  ): Promise<void> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [this.STORAGE_KEY]: configs }, () =>
            resolve()
          );
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        await browser.storage.local.set({ [this.STORAGE_KEY]: configs } as any);
        return;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
        return;
      }

      console.warn("No fallback storage available to save configs");
      return;
    } catch (err) {
      console.warn("Fallback saving configs failed:", err);
      return;
    }
  }

  // --- Helper methods (unchanged) ---

  private entityToConfig(entity: DirectionEntity): DirectionConfig {
    return {
      id: entity.id,
      isRTL: entity.isRTL,
      enabled: entity.enabled,
      targetUrls: entity.targetUrls,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private configToEntity(config: DirectionConfig): DirectionEntity {
    return new DirectionEntity(
      config.id,
      config.isRTL,
      config.enabled,
      config.targetUrls,
      new Date(config.createdAt),
      new Date(config.updatedAt)
    );
  }
}
