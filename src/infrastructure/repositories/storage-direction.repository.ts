// Add type declaration for 'browser' to support WebExtension API
declare const browser: typeof import("webextension-polyfill");

import {
  type DirectionConfig,
  DirectionEntity,
} from "../../core/entities/direction.entity";
import type { IDirectionRepository } from "../../core/repositories/direction-repository.interface";

export class StorageDirectionRepository implements IDirectionRepository {
  private readonly STORAGE_KEY = "direction-configs";

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

      // Fallback to localStorage for dev/non-extension contexts
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        return;
      }

      // No storage available in this environment: log and return
      console.warn("No fallback storage available to clear configs");
      return;
    } catch (err) {
      console.warn("Clearing configs failed:", err);
      return;
    }
  }

  private async getAllConfigs(): Promise<DirectionConfig[]> {
    try {
      // Prefer Chrome's storage API when available
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

      // Fall back to the browser (WebExtension) storage API if present
      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        console.log("Using browser.storage.local");
        const result = await browser.storage.local.get(this.STORAGE_KEY as any);
        console.log("Browser storage result:", result);
        return result[this.STORAGE_KEY] || [];
      }

      // As a last resort (development outside extension context), use window.localStorage if available
      if (typeof window !== "undefined" && window.localStorage) {
        console.log("Using window.localStorage");
        const raw = window.localStorage.getItem(this.STORAGE_KEY);
        console.log("LocalStorage raw:", raw);
        return raw ? (JSON.parse(raw) as DirectionConfig[]) : [];
      }

      // No storage available in this environment
      console.log("No storage available");
      return [];
    } catch (err) {
      console.warn("Storage access failed, returning empty configs:", err);
      return [];
    }
  }

  private async saveAllConfigs(configs: DirectionConfig[]): Promise<void> {
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

      // Fallback to localStorage for dev/non-extension contexts
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
        return;
      }

      // No storage available in this environment: log and return
      console.warn("No fallback storage available to save configs");
      return;
    } catch (err) {
      console.warn("Saving configs failed:", err);
      return;
    }
  }

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
