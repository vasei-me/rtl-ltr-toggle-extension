export interface DirectionConfig {
  id: string;
  isRTL: boolean;
  enabled: boolean;
  targetUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class DirectionEntity {
  constructor(
    public readonly id: string,
    public isRTL: boolean,
    public enabled: boolean,
    public targetUrls: string[],
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  toggleDirection(): void {
    this.isRTL = !this.isRTL;
    this.updatedAt = new Date();
  }

  toggleEnabled(): void {
    this.enabled = !this.enabled;
    this.updatedAt = new Date();
  }

  addTargetUrl(url: string): void {
    if (!this.targetUrls.includes(url)) {
      this.targetUrls.push(url);
      this.updatedAt = new Date();
    }
  }

  removeTargetUrl(url: string): void {
    this.targetUrls = this.targetUrls.filter((u) => u !== url);
    this.updatedAt = new Date();
  }

  matchesUrl(url: string): boolean {
    return this.targetUrls.some((targetUrl) => url.includes(targetUrl));
  }
}
