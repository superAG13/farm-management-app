import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header/Header.jsx";
import "./index.css";
import Farm from "./pages/farm/Farm.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Header />
    <Farm />
  </React.StrictMode>
);
