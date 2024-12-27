"use client";

import { PixiViewer } from "@/components/PixiViewer";
import { PixiViewerSettings } from "@/components/PixiViewerSettings";

const ScenePage = () => {
  return (
    <>
      <PixiViewer />
      <PixiViewerSettings />
    </>
  );
};

export default ScenePage;
