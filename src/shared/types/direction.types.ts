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
