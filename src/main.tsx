import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,

      staleTime: 10_000,
    },
  },
});

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  return worker.start();
}

enableMocking().then(() => {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Root element not found.");
  }

  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
