import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

export default {
  config,
  logLevel: "info",
  manifest: {
    name: "RTL/LTR Extension",
    description: "Toggle between RTL and LTR text direction for websites",
    version: "1.0.0",
    // این بخش را اضافه کنید تا Plasmo پاپاپ را بسازد
    action: {},
  },
  framework: "react",
};
