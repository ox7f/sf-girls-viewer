import type { FC } from "react";
import { PixiViewer } from "../components/PixiViewer";
import { PixiViewerSettings } from "../components/PixiViewerSettings";
import PixiVN from "../components/PixiVN";

const ScenePage: FC = () => {
  return (
    <>
      <PixiViewer />
      <PixiViewerSettings />
      <PixiVN />
    </>
  );
};

export default ScenePage;
