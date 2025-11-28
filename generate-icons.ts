import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

export default {
  config,
  logLevel: "info", // "debug" برای توسعه عالی است، اما "info" برای حالت عادی بهتر است
  manifest: {
    name: "RTL/LTR Extension",
    description: "Toggle between RTL and LTR text direction for websites",
    version: "1.0.0",
  },
};
