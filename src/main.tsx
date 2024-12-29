import "./index.css";

import "cirrus-ui";
import "pixi-spine";

import { Provider } from "jotai";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";
import { Gallery, Home, Scenes } from "./pages/index.tsx";

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
  // <StrictMode>
  <Provider>
    <RouterProvider router={router} />
  </Provider>,
  // </StrictMode>,
);
