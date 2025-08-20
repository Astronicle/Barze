import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";

function App() {
  const [barMode, setBarMode] = useState(false);

  return (
    <>
      <Navbar barMode={barMode} setBarMode={setBarMode}/>
      <Hero barMode={barMode} setBarMode={setBarMode} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
    <App />
);