import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./App";
import { RouterProvider } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioProvider>
      <RouterProvider router={router} />
    </PortfolioProvider>
  </StrictMode>,
);
