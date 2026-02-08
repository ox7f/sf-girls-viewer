import { FC, Suspense, lazy } from "react";
import { Spinner } from "../components/common/Spinner";

export { ErrorBoundary } from "./ErrorBoundary";

const GalleryPage = lazy(() => import("./GalleryPage"));
const ScenePage = lazy(() => import("./ScenePage"));

export const Gallery: FC = () => (
  <Suspense fallback={<Spinner />}>
    <GalleryPage />
  </Suspense>
);

export const Scenes: FC = () => (
  <Suspense fallback={<Spinner />}>
    <ScenePage />
  </Suspense>
);
