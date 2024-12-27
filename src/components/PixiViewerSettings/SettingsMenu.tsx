"use client";

import { useAtom } from "jotai";
import type { FC } from "react";
import { selectedMenuTabAtom } from "@/atoms/atoms";
import PixiViewerSettingsAnimation from "@/components/PixiViewerSettings/PixiViewerSettingsAnimation";
import PixiViewerSettingsGlobal from "@/components/PixiViewerSettings/PixiViewerSettingsGlobal";
import PixiViewerSettingsScene from "@/components/PixiViewerSettings/PixiViewerSettingsScene";
import { menuItems } from "@/utils/DropdownUtils";

const tabComponents = {
  [menuItems[0]]: PixiViewerSettingsScene,
  [menuItems[1]]: PixiViewerSettingsGlobal,
  default: PixiViewerSettingsAnimation,
};

const SettingsMenu: FC = () => {
  const [selectedTab, setSelectedTab] = useAtom(selectedMenuTabAtom);

  const renderTabContent = () => {
    const SelectedComponent =
      tabComponents[selectedTab] || tabComponents.default;

    return (
      <SelectedComponent
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );
  };

  return (
    <div
      className="u-absolute u-top-1 u-right-2 u-shadow-lg bg-white u-round-xs animated fadeIn"
      style={{ width: "20rem", marginTop: "3.25rem" }}
    >
      <div className="tab-container tabs--center">
        <ul className="mb-0 pt-1">
          {menuItems.map((item) => (
            <li
              key={item}
              className={selectedTab === item ? "selected" : ""}
              onClick={() => setSelectedTab(item)}
            >
              <div className="tab-item-content">
                <span>{item}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default SettingsMenu;
