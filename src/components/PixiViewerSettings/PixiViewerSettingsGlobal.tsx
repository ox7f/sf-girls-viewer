import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent } from "react";
import { pixiAppAtom, pixiAppSettingsGlobalAtom } from "../../atoms";

export const PixiViewerSettingsGlobal = () => {
  const app = useAtomValue(pixiAppAtom);
  const [settings, setSettings] = useAtom(pixiAppSettingsGlobalAtom);

  if (!app) {
    return;
  }

  const handleChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const stringValue = event.target.value;
      const numberValue = Number(stringValue);
      const value = isNaN(numberValue) ? stringValue : numberValue;
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
      <div
        className="tooltip"
        data-tooltip={`${Math.round(settings.backgroundAlpha * 100)} %`}
      >
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
    </fieldset>
  );
};
