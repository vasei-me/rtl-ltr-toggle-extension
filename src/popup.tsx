import { useState } from "react"; // فقط useState را وارد می‌کنیم

function App() {
  // دیگر از React.useState استفاده نمی‌کنیم
  const [text, setText] = useState("Hello World!");

  const toggleDirection = () => {
    const newDirection =
      text === "Hello World!"
        ? "RTL/LTR Extension is working!"
        : "Hello World!";
    setText(newDirection);
  };

  return (
    <div
      style={{ width: "200px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h3>{text}</h3>
      <button onClick={toggleDirection}>Click Me</button>
    </div>
  );
}

export default App;
