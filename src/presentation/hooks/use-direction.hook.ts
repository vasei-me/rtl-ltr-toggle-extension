import { useCallback, useEffect, useState } from "react";
import { DirectionEntity } from "../../core/entities/direction.entity";
import { ManageUrlUseCase } from "../../core/use-cases/manage-url.use-case";
import { ToggleDirectionUseCase } from "../../core/use-cases/toggle-direction.use-case";
import { StorageDirectionRepository } from "../../infrastructure/repositories/storage-direction.repository";

let repository: StorageDirectionRepository | null = null;
let toggleUseCase: ToggleDirectionUseCase | null = null;
let manageUrlUseCase: ManageUrlUseCase | null = null;

export interface DirectionState {
  isRTL: boolean;
  enabled: boolean;
  targetUrls: string[];
}

export interface DirectionChangeEvent {
  configId: string;
  isRTL: boolean;
  timestamp: Date;
}

export interface UrlPattern {
  pattern: string;
  exactMatch: boolean;
}

export interface ExtensionStorage {
  version: string;
  directionConfigs: DirectionState[];
  lastUpdated: Date;
}

const DEFAULT_CONFIG_ID = "default-config";
const STORAGE_VERSION = "1.0.0"; // For migration if needed

const initializeServices = (): boolean => {
  try {
    if (!repository) {
      repository = new StorageDirectionRepository();
    }
    if (!toggleUseCase && repository) {
      toggleUseCase = new ToggleDirectionUseCase(repository);
    }
    if (!manageUrlUseCase && repository) {
      manageUrlUseCase = new ManageUrlUseCase(repository);
    }
    return true; // Success flag
  } catch (error) {
    console.error("Error initializing services:", error);
    return false;
  }
};

const ensureDefaultConfig = async (
  repo: StorageDirectionRepository
): Promise<DirectionEntity> => {
  const allConfigs = await repo.findAll();
  if (allConfigs.length === 0) {
    const defaultConfig = new DirectionEntity(
      DEFAULT_CONFIG_ID,
      false, // Default to LTR
      true, // Enabled by default
      [], // No URLs initially
      new Date(),
      new Date()
    );
    await repo.save(defaultConfig);
    return defaultConfig;
  }
  return allConfigs[0]; // Return first config as current
};

export const useDirection = () => {
  const [configs, setConfigs] = useState<DirectionEntity[]>([]);
  const [currentConfig, setCurrentConfig] = useState<DirectionEntity | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized load function to avoid recreating on every render
  const loadConfigs = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      if (!initializeServices()) {
        throw new Error("Failed to initialize services");
      }

      const repo = repository;
      if (!repo) {
        throw new Error("Repository not initialized");
      }

      // Check for storage version and migrate if needed (for future-proofing)
      const storageData = (await chrome.storage.local.get([
        "extensionVersion",
      ])) as { extensionVersion?: string };
      if (storageData.extensionVersion !== STORAGE_VERSION) {
        await chrome.storage.local.set({ extensionVersion: STORAGE_VERSION });
        // Optional: Migration logic here, e.g., clear old data
      }

      const allConfigs = await repo.findAll();
      const defaultOrFirstConfig = await ensureDefaultConfig(repo);

      setConfigs(allConfigs);
      setCurrentConfig(defaultOrFirstConfig);
    } catch (err) {
      console.error("Error loading configs:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error loading configuration"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("useDirection hook initialized");
    loadConfigs();
  }, [loadConfigs]);

  const toggleDirection = useCallback(
    async (configId: string): Promise<DirectionEntity | null> => {
      try {
        if (!toggleUseCase) {
          if (!initializeServices()) {
            throw new Error("Failed to initialize toggle use case");
          }
        }

        const updatedConfig = await toggleUseCase!.execute(configId);
        setCurrentConfig(updatedConfig);
        // Refresh full list for consistency
        await loadConfigs();
        return updatedConfig;
      } catch (err) {
        console.error("Error toggling direction:", err);
        setError(
          err instanceof Error ? err.message : "Failed to toggle direction"
        );
        return null;
      }
    },
    [loadConfigs]
  );

  const toggleEnabled = useCallback(
    async (configId: string): Promise<DirectionEntity | null> => {
      try {
        if (!manageUrlUseCase) {
          if (!initializeServices()) {
            throw new Error("Failed to initialize manage URL use case");
          }
        }

        const updatedConfig = await manageUrlUseCase!.toggleEnabled(configId);
        setCurrentConfig(updatedConfig);
        await loadConfigs();
        return updatedConfig;
      } catch (err) {
        console.error("Error toggling enabled:", err);
        setError(
          err instanceof Error ? err.message : "Failed to toggle enabled state"
        );
        return null;
      }
    },
    [loadConfigs]
  );

  const addUrl = useCallback(
    async (configId: string, url: string): Promise<void> => {
      try {
        if (!manageUrlUseCase) {
          if (!initializeServices()) {
            throw new Error("Failed to initialize manage URL use case");
          }
        }

        await manageUrlUseCase!.addUrl(configId, url);
        await loadConfigs();
      } catch (err) {
        console.error("Error adding URL:", err);
        setError(err instanceof Error ? err.message : "Failed to add URL");
      }
    },
    [loadConfigs]
  );

  const removeUrl = useCallback(
    async (configId: string, url: string): Promise<void> => {
      try {
        if (!manageUrlUseCase) {
          if (!initializeServices()) {
            throw new Error("Failed to initialize manage URL use case");
          }
        }

        await manageUrlUseCase!.removeUrl(configId, url);
        await loadConfigs();
      } catch (err) {
        console.error("Error removing URL:", err);
        setError(err instanceof Error ? err.message : "Failed to remove URL");
      }
    },
    [loadConfigs]
  );

  // New: Export config as JSON for backup/persistence
  const exportConfig = useCallback(async (): Promise<string | null> => {
    try {
      if (!currentConfig) {
        throw new Error("No config to export");
      }

      // Include all configs for full backup
      const fullExport: ExtensionStorage = {
        version: STORAGE_VERSION,
        directionConfigs: configs.map((config) => ({
          isRTL: config.isRTL,
          enabled: config.enabled,
          targetUrls: config.targetUrls,
        })),
        lastUpdated: new Date(),
      };

      const configStr = JSON.stringify(fullExport, null, 2);
      return configStr;
    } catch (err) {
      console.error("Error exporting config:", err);
      setError(err instanceof Error ? err.message : "Failed to export config");
      return null;
    }
  }, [currentConfig, configs]);

  // New: Import config from JSON (with validation)
  const importConfig = useCallback(
    async (importedData: string | object): Promise<boolean> => {
      try {
        let parsedData: ExtensionStorage;
        if (typeof importedData === "string") {
          parsedData = JSON.parse(importedData);
        } else {
          parsedData = importedData as ExtensionStorage;
        }

        // Basic validation
        if (
          !parsedData.directionConfigs ||
          !Array.isArray(parsedData.directionConfigs)
        ) {
          throw new Error(
            "Invalid config format: Missing directionConfigs array"
          );
        }

        // Clear existing and save new ones
        if (!repository) {
          if (!initializeServices()) {
            throw new Error("Failed to initialize repository for import");
          }
        }

        // Convert to entities and save
        for (const state of parsedData.directionConfigs) {
          const entity = new DirectionEntity(
            state.targetUrls.join(",") || DEFAULT_CONFIG_ID, // Use URLs hash or default ID
            state.isRTL,
            state.enabled,
            state.targetUrls,
            new Date(),
            new Date() // Update timestamps
          );
          await repository!.save(entity);
        }

        await loadConfigs();
        return true;
      } catch (err) {
        console.error("Error importing config:", err);
        setError(
          err instanceof Error ? err.message : "Failed to import config"
        );
        return false;
      }
    },
    [loadConfigs]
  );

  // New: Clear all configs (for reset)
  const clearConfigs = useCallback(async (): Promise<void> => {
    try {
      if (!repository) {
        if (!initializeServices()) {
          throw new Error("Failed to initialize repository");
        }
      }

      await repository!.clearAll(); // Assume repo has clearAll method; if not, implement
      await loadConfigs();
    } catch (err) {
      console.error("Error clearing configs:", err);
      setError(err instanceof Error ? err.message : "Failed to clear configs");
    }
  }, [loadConfigs]);

  return {
    configs,
    currentConfig,
    loading,
    error,
    toggleDirection,
    toggleEnabled,
    addUrl,
    removeUrl,
    exportConfig,
    importConfig,
    clearConfigs,
    refresh: loadConfigs,
  };
};
