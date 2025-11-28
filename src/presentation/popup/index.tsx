import { useStorage } from "@plasmohq/storage/hook";

function Popup() {
  const [direction, setDirection] = useStorage("direction-key", "ltr");

  const toggleDirection = () => {
    const newDirection = direction === "ltr" ? "rtl" : "ltr";
    setDirection(newDirection);

    // ارسال پیام به content script برای تغییر جهت
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "changeDirection",
          direction: newDirection,
        });
      }
    });
  };

  return (
    <div
      style={{
        width: "200px",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ margin: "0 0 12px 0" }}>
        Current Direction: <strong>{direction}</strong>
      </p>
      <button
        onClick={toggleDirection}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Toggle Direction
      </button>
    </div>
  );
}

export default Popup;
