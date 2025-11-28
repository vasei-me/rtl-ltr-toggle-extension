import type { PlasmoCSConfig } from "plasmo";
import { StorageDirectionRepository } from "~infrastructure/repositories/storage-direction.repository";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

class DirectionApplier {
  private repository = new StorageDirectionRepository();
  private observer: MutationObserver | null = null;
  private isContextValid = true;

  constructor() {
    this.init();
    this.setupContextListener();
  }

  private setupContextListener() {
    // Listen for when the extension context is about to be invalidated
    window.addEventListener("beforeunload", () => {
      this.isContextValid = false;
      this.stopObserver();
    });

    // Also handle when the page is unloading
    if (document.addEventListener) {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.isContextValid = false;
          this.stopObserver();
        }
      });
    }
  }

  private async init() {
    try {
      const configs = await this.repository.findAll();
      const currentUrl = window.location.href;

      const applicableConfig = configs.find(
        (config) =>
          config.enabled &&
          config.targetUrls.some((url) => currentUrl.includes(url))
      );

      if (applicableConfig) {
        this.applyDirection(applicableConfig.isRTL);
        this.observeChanges();
      }
    } catch (error) {
      console.error("Error applying direction:", error);
    }
  }

  private applyDirection(isRTL: boolean) {
    const direction = isRTL ? "rtl" : "ltr";
    const textAlign = isRTL ? "right" : "left";

    document.documentElement.setAttribute("dir", direction);
    document.documentElement.style.direction = direction;
    document.documentElement.style.textAlign = textAlign;

    document.body.setAttribute("dir", direction);
    document.body.style.direction = direction;
    document.body.style.textAlign = textAlign;

    console.log(
      `RTL/LTR Extension: Direction applied - ${direction.toUpperCase()}`
    );
  }

  private observeChanges() {
    if (!this.isContextValid || !document.body) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      // Check if context is still valid before processing
      if (!this.isContextValid) {
        this.stopObserver();
        return;
      }

      try {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.hasAttribute("dir")) {
                  element.setAttribute(
                    "dir",
                    document.documentElement.getAttribute("dir") || "ltr"
                  );
                }
              }
            });
          }
        });
      } catch (error) {
        // Silently catch errors when context is invalidated
        console.debug("Observer error (possibly context invalidated):", error);
        this.stopObserver();
      }
    });

    try {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error("Failed to start observing:", error);
    }
  }

  private stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new DirectionApplier());
} else {
  new DirectionApplier();
}
