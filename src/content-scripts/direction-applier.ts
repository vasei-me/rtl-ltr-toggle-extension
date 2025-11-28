import { StorageDirectionRepository } from "../infrastructure/repositories/storage-direction.repository";

class DirectionApplier {
  private repository = new StorageDirectionRepository();
  private observer: MutationObserver | null = null;
  private isContextValid = true;

  constructor() {
    this.setupContextListener();
    this.init();
  }

  private setupContextListener() {
    try {
      window.addEventListener("beforeunload", () => {
        this.isContextValid = false;
        this.stopObserver();
      });

      if (document.addEventListener) {
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            this.isContextValid = false;
            this.stopObserver();
          }
        });
      }
    } catch (error) {
      console.debug("Context listener setup error:", error);
    }
  }

  private async init() {
    try {
      if (!this.isContextValid) {
        return;
      }

      const configs = await this.repository.findAll();
      const currentUrl = window.location.href;

      const applicableConfig = configs.find(
        (config) =>
          config.enabled &&
          config.targetUrls.some((url) => currentUrl.includes(url))
      );

      if (applicableConfig && this.isContextValid) {
        this.applyDirection(applicableConfig.isRTL);
        this.observeChanges();
      }
    } catch (error) {
      console.error("Error applying direction:", error);
    }
  }

  private applyDirection(isRTL: boolean) {
    try {
      const direction = isRTL ? "rtl" : "ltr";
      const textAlign = isRTL ? "right" : "left";

      if (document.documentElement) {
        document.documentElement.setAttribute("dir", direction);
        document.documentElement.style.direction = direction;
        document.documentElement.style.textAlign = textAlign;
      }

      if (document.body) {
        document.body.setAttribute("dir", direction);
        document.body.style.direction = direction;
        document.body.style.textAlign = textAlign;
      }

      console.log(
        `RTL/LTR Extension: Direction applied - ${direction.toUpperCase()}`
      );
    } catch (error) {
      console.error("Error in applyDirection:", error);
    }
  }

  private observeChanges() {
    if (!this.isContextValid || !document.body) {
      return;
    }

    try {
      this.observer = new MutationObserver((mutations) => {
        if (!this.isContextValid) {
          this.stopObserver();
          return;
        }

        try {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                try {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    if (element.hasAttribute("dir")) {
                      element.setAttribute(
                        "dir",
                        document.documentElement.getAttribute("dir") || "ltr"
                      );
                    }
                  }
                } catch (error) {
                  // Skip individual node errors
                }
              });
            }
          });
        } catch (error) {
          console.debug("Mutation observer error:", error);
          this.stopObserver();
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error("Failed to start observer:", error);
    }
  }

  private stopObserver() {
    if (this.observer) {
      try {
        this.observer.disconnect();
        this.observer = null;
      } catch (error) {
        console.debug("Error disconnecting observer:", error);
      }
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      new DirectionApplier();
    } catch (error) {
      console.error("Failed to initialize DirectionApplier:", error);
    }
  });
} else {
  try {
    new DirectionApplier();
  } catch (error) {
    console.error("Failed to initialize DirectionApplier:", error);
  }
}
