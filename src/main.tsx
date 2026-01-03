import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

import { StoreInitializer } from "@/components/store-initializer";

import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreInitializer>
      <RouterProvider router={router} />
      <Toaster position={"bottom-right"} />
    </StoreInitializer>
  </React.StrictMode>
);
