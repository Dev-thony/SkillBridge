import React from "react";
import ReactDOM from "react-dom/client";
import "./components/ui/ui.css";

import App from "./App.jsx";

import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
