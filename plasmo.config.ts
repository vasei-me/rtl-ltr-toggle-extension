import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

export default {
  config,
  logLevel: "debug",
  manifest: {
    name: "RTL/LTR Extension",
  },
};
