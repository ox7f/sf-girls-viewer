"use client";

import { useAtomValue } from "jotai";
import { ChangeEvent, useState } from "react";
import { pixiAppAtom } from "@/atoms";

export const PixiViewerSettingsGlobal = () => {
  const app = useAtomValue(pixiAppAtom);

  const [settings, setSettings] = useState({
    backgroundColor: app?.renderer.background.color,
    backgroundAlpha: app?.renderer.background.alpha ?? 0,
    scale: app?.stage.scale.x ?? 1,
  });

  if (!app) {
    return;
  }

  const { renderer, stage } = app;

  const handleChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const stringValue = event.target.value;
      const numberValue = Number(stringValue);

      const value = isNaN(numberValue) ? stringValue : numberValue;

      if (key === "backgroundColor") {
        renderer.background.color = stringValue;
        renderer.background.alpha = settings.backgroundAlpha;
      } else if (key === "backgroundAlpha") {
        renderer.background.alpha = numberValue;
      } else if (key === "scale") {
        stage.scale.set(numberValue);
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
    };

  return (
    <fieldset className="u-flex u-flex-column animated fadeIn">
      <div>
        <label htmlFor="color">Background Color</label>
        <input
          id="color"
          type="color"
          name="color"
          value={settings.backgroundColor as string}
          onChange={handleChange("backgroundColor")}
        />
      </div>
      <div className="tooltip" data-tooltip={settings.backgroundAlpha}>
        <label htmlFor="alpha">Background Transparency</label>
        <input
          id="alpha"
          type="range"
          name="alpha"
          min="0"
          max="1"
          step={0.01}
          value={settings.backgroundAlpha}
          onChange={handleChange("backgroundAlpha")}
        />
      </div>
      <div
        className="tooltip"
        data-tooltip={`${Math.round(settings.scale * 100)}%`}
      >
        <label htmlFor="scale">Zoom</label>
        <input
          id="scale"
          type="range"
          name="scale"
          min="0"
          max="2"
          step={0.05}
          value={settings.scale}
          onChange={handleChange("scale")}
        />
      </div>
    </fieldset>
  );
};
