export interface StorageChange<T = any> {
  oldValue?: T;
  newValue?: T;
}

export interface StorageArea {
  get(keys?: string | string[] | object): Promise<{ [key: string]: any }>;
  set(items: { [key: string]: any }): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

export interface StorageUpdate {
  [key: string]: StorageChange;
}

export interface StorageListener {
  (changes: StorageUpdate, area: string): void;
}
