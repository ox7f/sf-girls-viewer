import type { FC } from "react";
import { PixiViewer } from "../components/PixiViewer";
import { PixiViewerSettings } from "../components/PixiViewerSettings";

const ScenePage: FC = () => {
  return (
    <>
      <PixiViewer />
      <PixiViewerSettings />
    </>
  );
};

export default ScenePage;
