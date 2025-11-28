export class DirectionUtils {
  static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url.toLowerCase().trim();
    }
  }

  static isValidUrlPattern(pattern: string): boolean {
    if (!pattern || pattern.length === 0) return false;

    try {
      new URL(pattern.startsWith("http") ? pattern : `https://${pattern}`);
      return true;
    } catch {
      return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(pattern);
    }
  }

  static shouldApplyDirection(
    currentUrl: string,
    targetUrls: string[]
  ): boolean {
    return targetUrls.some((targetUrl) => {
      const normalizedTarget = this.normalizeUrl(targetUrl);
      const normalizedCurrent = this.normalizeUrl(currentUrl);
      return normalizedCurrent.includes(normalizedTarget);
    });
  }

  static generateId(): string {
    return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDirectionText(isRTL: boolean): string {
    return isRTL ? "rtl" : "ltr";
  }

  static getDirectionEmoji(isRTL: boolean): string {
    return isRTL ? "🔁" : "🔀";
  }
}
