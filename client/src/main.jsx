import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";

import "./components/ui/ui.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/theme-overrides.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);