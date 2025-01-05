import { useAtomValue } from "jotai";
import { type ISpineDebugRenderer, SpineDebugRenderer } from "pixi-spine";
import { type ChangeEvent, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { pixiAnimationListAtom } from "../../atoms";
import type {
  ModifiedContainer,
  ModifiedLive2D,
  ModifiedSpine,
} from "../../types";
import {
  getAnimations,
  getIsLive2D,
  getSkins,
  handleTouchAnimationLive2D,
  handleTouchAnimationSpine,
  menuItems,
} from "../../utils";

type Props = {
  selectedTab: string | number;
  setSelectedTab: (value: string | number) => void;
};

export const PixiViewerSettingsAnimation = ({
  selectedTab,
  setSelectedTab,
}: Props) => {
  const animationList = useAtomValue(pixiAnimationListAtom);
  const animation = animationList.find(
    (listItem) => listItem.meta.index === selectedTab,
  );

  const [settings, setSettings] = useState({
    x: animation?.x ?? 0,
    y: animation?.y ?? 0,
    // general
    alpha: animation?.parent.alpha ?? 0,
    angle: animation?.parent.angle ?? 0,
    scale: animation?.parent.scale.x ?? 1,
    skew: animation?.parent.scale.x ?? 0.5,
    timeScale: 1,
    allowClick: true,
    allowDrag: true,
    autoUpdate: true,
    // debug
    debug: false,
  });

  if (!animation) {
    return;
  }

  const isLive2D = getIsLive2D(animation);
  const animations = getAnimations(animation, isLive2D);
  const skins = getSkins(animation, isLive2D);

  const handleChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      switch (key) {
        case "x":
          animation.x = parseFloat(value);
          break;
        case "y":
          animation.y = parseFloat(value);
          break;
        case "alpha":
          animation.parent.alpha = parseFloat(value);
          break;
        case "angle":
          animation.parent.angle = parseFloat(value);
          break;
        case "scale":
          // animation.parent.scale.set(parseFloat(value));
          animation.scale.set(parseFloat(value));
          break;
        case "skew":
          animation.parent.skew.set(parseFloat(value) * Math.PI - Math.PI / 2);
          break;
        case "timeScale":
          if (isLive2D) {
            // TODO:
          } else {
            (animation as ModifiedSpine).state.timeScale = parseFloat(value);
          }
          break;
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
    };

  const handleToggle =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;

      switch (key) {
        case "autoUpdate":
          if (isLive2D) {
            // TODO:
          } else {
            (animation as ModifiedSpine).autoUpdate = checked;
          }
          break;
        case "allowClick":
          (animation.parent as ModifiedContainer).allowClick = checked;
          break;
        case "allowDrag":
          (animation.parent as ModifiedContainer).allowDrag = checked;
          break;
        case "debug":
          if (isLive2D) {
            // TODO:
          } else {
            (animation as ModifiedSpine).debug = checked
              ? new SpineDebugRenderer()
              : (null as unknown as ISpineDebugRenderer);
          }
          break;
      }

      setSettings((prev) => ({ ...prev, [key]: checked }));
    };

  const playAnimation = (animationName: string) => {
    if (isLive2D) {
      handleTouchAnimationLive2D(animation as ModifiedLive2D, animationName);
    } else {
      handleTouchAnimationSpine(animation as ModifiedSpine, animationName);
    }
  };

  const changeSkin = (skinName: string) => {
    (animation as ModifiedSpine).skeleton.setSkinByName(skinName);
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

      <fieldset
        className="u-flex u-flex-column animated fadeIn u-overflow-x-auto"
        style={{ maxHeight: "25rem" }}
      >
        <details className="accordion">
          <summary className="accordion__summary u-no-outline">General</summary>
          <div className="tooltip" data-tooltip={settings.x}>
            <label htmlFor="x">X</label>
            <input
              id="x"
              type="range"
              name="x"
              min="-1000"
              max="1000"
              step={1}
              value={settings.x}
              onChange={handleChange("x")}
            />
          </div>
          <div className="tooltip" data-tooltip={settings.y}>
            <label htmlFor="y">Y</label>
            <input
              id="y"
              type="range"
              name="y"
              min="-1000"
              max="1000"
              step={1}
              value={settings.y}
              onChange={handleChange("y")}
            />
          </div>

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
            <label htmlFor="angle">Angle</label>
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
              max="4"
              step={0.01}
              value={settings.scale}
              onChange={handleChange("scale")}
            />
          </div>
          <div className="tooltip" data-tooltip={settings.skew}>
            <label htmlFor="skew">Skew</label>
            <input
              id="skew"
              type="range"
              name="skew"
              min="0"
              max="1"
              step={0.01}
              value={settings.skew}
              onChange={handleChange("skew")}
            />
          </div>
          <div
            className="tooltip"
            data-tooltip={`${Math.round(settings.timeScale * 100)} %`}
          >
            <label htmlFor="timeScale">Playback Speed</label>
            <input
              id="timeScale"
              type="range"
              name="timeScale"
              min="0"
              max="4"
              step={0.05}
              value={settings.timeScale}
              onChange={handleChange("timeScale")}
            />
          </div>
          <div className="form-ext-control form-ext-checkbox">
            <input
              id="allowClick"
              className="form-ext-input"
              type="checkbox"
              checked={settings.allowClick}
              onChange={handleToggle("allowClick")}
            />
            <label className="form-ext-label" htmlFor="allowClick">
              Allow Click
            </label>
          </div>
          <div className="form-ext-control form-ext-checkbox">
            <input
              id="allowDrag"
              className="form-ext-input"
              type="checkbox"
              checked={settings.allowDrag}
              onChange={handleToggle("allowDrag")}
            />
            <label className="form-ext-label" htmlFor="allowDrag">
              Allow Drag
            </label>
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
              Auto Update Animation
            </label>
          </div>
        </details>

        {animations.length > 0 && (
          <details className="accordion">
            <summary className="accordion__summary u-no-outline">
              Animations
            </summary>
            {animations.map((animationName) => (
              <button
                key={animationName}
                className=" w-100p"
                onClick={() => playAnimation(animationName)}
              >
                {animationName}
              </button>
            ))}
          </details>
        )}

        {skins.length > 0 && (
          <details className="accordion">
            <summary className="accordion__summary u-no-outline">Skins</summary>
            {skins.map((skinName) => (
              <button
                key={skinName}
                className=" w-100p"
                onClick={() => changeSkin(skinName)}
              >
                {skinName}
              </button>
            ))}
          </details>
        )}

        <details className="accordion">
          <summary className="accordion__summary u-no-outline">Debug</summary>
          <div className="form-ext-control form-ext-checkbox">
            <input
              id="debug"
              className="form-ext-input"
              type="checkbox"
              checked={settings.debug}
              onChange={handleToggle("debug")}
            />
            <label className="form-ext-label" htmlFor="debug">
              Debug Rendering
            </label>
          </div>
        </details>
      </fieldset>
    </div>
  );
};
