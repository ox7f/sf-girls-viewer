"use client";

import { useAtomValue } from "jotai";
import { type ISpineDebugRenderer, SpineDebugRenderer } from "pixi-spine";
import { type ChangeEvent, type FC, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";

import { pixiAnimationListAtom } from "@/atoms/atoms";
import { menuItems } from "@/utils/DropdownUtils";

type Props = {
  selectedTab: string | number;
  setSelectedTab: (value: string | number) => void;
};

export const PixiViewerSettingsAnimation: FC<Props> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const animationList = useAtomValue(pixiAnimationListAtom);
  const animation = animationList.find(
    (listItem) => listItem.meta.index === selectedTab,
  );

  const [settings, setSettings] = useState({
    alpha: animation?.parent.alpha ?? 0,
    angle: animation?.parent.angle ?? 0,
    scale: animation?.parent.scale.x ?? 1.1,
    skew: animation?.parent.skew ?? 0,
    autoUpdate: true,
    allowClick: true,
    allowDrag: true,
    debug: false,
  });

  if (!animation) {
    return;
  }

  const handleChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      switch (key) {
        case "alpha":
          animation.parent.alpha = parseFloat(value);
          break;
        case "angle":
          animation.parent.angle = parseFloat(value);
          break;
        case "scale":
          animation.parent.scale.set(parseFloat(value));
          break;
        case "skew":
          animation.parent.skew.set(parseFloat(value));
          break;
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
    };

  const handleToggle =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;

      switch (key) {
        case "autoUpdate":
          animation.autoUpdate = checked;
          break;
        case "allowClick":
          // TODO:
          break;
        case "allowDrag":
          // TODO:
          break;
        case "debug":
          animation.debug = checked
            ? new SpineDebugRenderer()
            : (null as unknown as ISpineDebugRenderer);
          break;
      }

      setSettings((prev) => ({ ...prev, [key]: checked }));
    };

  const goBack = () => setSelectedTab(menuItems[0]);

  return (
    <div>
      <div
        className="tile u-border-1 border-gray-200"
        style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}
      >
        <div className="tile__icon">
          <button className="btn btn-transparent h-100p" onClick={goBack}>
            <FaAngleLeft size={16} />
          </button>
        </div>
        <div className="tile__container p-1">
          <p className="tile__title m-0">{animation.meta.name}</p>
          <p className="tile__subtitle m-0">{animation.meta.config.name}</p>
        </div>
      </div>

      <fieldset className="u-flex u-flex-column animated fadeIn">
        <details className="accordion">
          <summary className="accordion__summary u-no-outline">General</summary>
          <div className="tooltip" data-tooltip={settings.alpha}>
            <label htmlFor="alpha">Alpha</label>
            <input
              id="alpha"
              type="range"
              name="alpha"
              min="0"
              max="1"
              step={0.01}
              value={settings.alpha}
              onChange={handleChange("alpha")}
            />
          </div>
          <div className="tooltip" data-tooltip={`${settings.angle}°`}>
            <label htmlFor="angle">Rotation</label>
            <input
              id="angle"
              type="range"
              name="angle"
              min="0"
              max="360"
              step={1}
              value={settings.angle}
              onChange={handleChange("angle")}
            />
          </div>
          <div className="tooltip" data-tooltip={settings.scale}>
            <label htmlFor="alpha">Scale</label>
            <input
              id="alpha"
              type="range"
              name="alpha"
              min="0"
              max="1"
              step={0.01}
              value={settings.scale}
              onChange={handleChange("scale")}
            />
          </div>
          <div className="form-ext-control form-ext-checkbox">
            <input
              id="autoUpdate"
              className="form-ext-input"
              type="checkbox"
              checked={settings.autoUpdate}
              onChange={handleToggle("autoUpdate")}
            />
            <label className="form-ext-label" htmlFor="autoUpdate">
              Auto Update
            </label>
          </div>
          <div className="form-ext-control form-ext-checkbox">
            <input
              id="interactive"
              className="form-ext-input"
              type="checkbox"
              checked={settings.allowClick}
              onChange={handleToggle("allowClick")}
            />
            <label className="form-ext-label" htmlFor="interactive">
              Allow Click
            </label>
          </div>

          <div className="form-ext-control form-ext-checkbox">
            <input
              id="debug"
              className="form-ext-input"
              type="checkbox"
              checked={settings.debug}
              onChange={handleToggle("debug")}
            />
            <label className="form-ext-label" htmlFor="debug">
              Debug
            </label>
          </div>
        </details>

        <p>
          <span>General</span>
          <span>data from root object</span>
          Alpha, Scale, Skew, Rotation, Allow Click, Play Idle As Default
          Animation, Show Background, Allow Drag & Drop
        </p>

        <p>
          <span>Animations</span>
          <span>data from SpineData</span>
          List of Animations (Button?) <br />
          List of Skins
          <br />
        </p>

        <p>
          <span>Parts</span>
          <span>data from skeleton</span>
          List of Parts with Slide for Alpha (possible?)
        </p>

        <p>
          <span>Debug</span>
          List of Parts with Slide for Alpha (possible?) Show FPS Option
        </p>
      </fieldset>
    </div>
  );
};

export default PixiViewerSettingsAnimation;
