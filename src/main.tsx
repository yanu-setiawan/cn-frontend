import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { HeroUIProvider } from "@heroui/react";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Loader from "./components/Loader/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider locale="en-GB">
      <Suspense fallback={<Loader />}>
        <App />
        <Toaster position="top-center" />
      </Suspense>
    </HeroUIProvider>
  </React.StrictMode>,
);
