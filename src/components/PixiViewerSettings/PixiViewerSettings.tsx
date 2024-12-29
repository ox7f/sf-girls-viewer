import { useState } from "react";
import ScreenshotButton from "../../components/common/Button/ScreenshotButton";
import SidebarToggleButton from "../../components/common/Button/SidebarToggleButton";
import { SettingsMenu } from "../../components/PixiViewerSettings";

export const PixiViewerSettings = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />
      <ScreenshotButton />
      {isOpen && <SettingsMenu />}
    </>
  );
};
