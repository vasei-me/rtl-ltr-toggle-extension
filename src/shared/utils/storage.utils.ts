// Add type declaration for 'browser' to support WebExtension API
declare const browser: typeof import("webextension-polyfill");
export class StorageUtils {
  static async get<T>(key: string): Promise<T | null> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.get([key], (result: Record<string, any>) => {
            resolve(result[key] || null);
          });
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        const result = await browser.storage.local.get(key as any);
        return result[key] || null;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      }

      return null;
    } catch (err) {
      console.warn("StorageUtils.get failed:", err);
      return null;
    }
  }

  static async set(key: string, value: any): Promise<void> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, resolve);
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        await browser.storage.local.set({ [key]: value } as any);
        return;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
        return;
      }

      return;
    } catch (err) {
      console.warn("StorageUtils.set failed:", err);
      return;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.remove(key, resolve);
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        await browser.storage.local.remove(key as any);
        return;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }

      return;
    } catch (err) {
      console.warn("StorageUtils.remove failed:", err);
      return;
    }
  }

  static async clear(): Promise<void> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.clear(resolve);
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        await browser.storage.local.clear();
        return;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
        return;
      }

      return;
    } catch (err) {
      console.warn("StorageUtils.clear failed:", err);
      return;
    }
  }

  static async getAll(): Promise<{ [key: string]: any }> {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        return new Promise((resolve) => {
          chrome.storage.local.get(null, resolve);
        });
      }

      if (
        typeof browser !== "undefined" &&
        browser.storage &&
        browser.storage.local
      ) {
        return await browser.storage.local.get(null as any);
      }

      if (typeof window !== "undefined" && window.localStorage) {
        const result: { [key: string]: any } = {};
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k) {
            try {
              result[k] = JSON.parse(window.localStorage.getItem(k) as string);
            } catch (err) {
              result[k] = window.localStorage.getItem(k);
            }
          }
        }
        return result;
      }

      return {};
    } catch (err) {
      console.warn("StorageUtils.getAll failed:", err);
      return {};
    }
  }

  static async migrateData(oldKey: string, newKey: string): Promise<boolean> {
    try {
      const oldData = await this.get(oldKey);
      if (oldData) {
        await this.set(newKey, oldData);
        await this.remove(oldKey);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Migration failed:", error);
      return false;
    }
  }

  static getStorageInfo(): Promise<chrome.storage.StorageArea> {
    return new Promise((resolve) => {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local &&
          chrome.storage.local.getBytesInUse
        ) {
          chrome.storage.local.getBytesInUse((bytes: number) => {
            resolve({
              getBytesInUse: () => Promise.resolve(bytes),
            } as chrome.storage.StorageArea);
          });
          return;
        }

        // Fallback: estimate bytes from localStorage if available
        if (typeof window !== "undefined" && window.localStorage) {
          let bytes = 0;
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k) {
              const v = window.localStorage.getItem(k) || "";
              bytes += k.length + v.length;
            }
          }
          resolve({
            getBytesInUse: () => Promise.resolve(bytes),
          } as chrome.storage.StorageArea);
          return;
        }

        resolve({
          getBytesInUse: () => Promise.resolve(0),
        } as chrome.storage.StorageArea);
      } catch (err) {
        console.warn("getStorageInfo failed:", err);
        resolve({
          getBytesInUse: () => Promise.resolve(0),
        } as chrome.storage.StorageArea);
      }
    });
  }
}
