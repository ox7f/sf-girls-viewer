import "./index.css";

import "cirrus-ui";
import "pixi-spine";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";
import { Gallery, Home, Scenes } from "./pages/index.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/scene", element: <Scenes /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
    ,
  </QueryClientProvider>,
);
