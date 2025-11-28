import { createRoot } from "react-dom/client";
import Popup from "./presentation/popup";

console.log("Popup.tsx loaded");

const container = document.getElementById("popup-root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<Popup />);
