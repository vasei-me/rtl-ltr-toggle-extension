import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

// پیکربندی اصلی Plasmo
export default {
  logLevel: "info",
  manifest: {
    name: "RTL/LTR Extension",
    description: "Toggle between RTL and LTR text direction for websites",
    version: "1.0.0",
    permissions: ["storage", "activeTab"],
    action: {
      default_popup: "popup.html",
      default_title: "Toggle RTL/LTR",
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        all_frames: true,
        js: ["contents/content.ts"],
      },
    ],
  },
};
