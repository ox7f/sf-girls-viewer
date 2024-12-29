/* eslint-disable react-hooks/exhaustive-deps */

import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { Application, Color } from "pixi.js";
import {
  fileAtom,
  pixiAnimationListAtom,
  pixiAppAtom,
  pixiAppSettingsGlobalAtom,
} from "../atoms";
import type { FileMeta } from "../types";
import { initializePixiApp, addAnimation, removeAnimation } from "../utils";

export const PixiViewer = () => {
  const pixiContainer = useRef<HTMLDivElement | null>(null);

  const [app, setApp] = useAtom(pixiAppAtom);
  const appSettings = useAtomValue(pixiAppSettingsGlobalAtom);
  const [newFile, setNewFile] = useAtom(fileAtom);
  const [animationList, setAnimationList] = useAtom(pixiAnimationListAtom);

  useEffect(() => {
    const pixiApp = initializePixiApp();
    pixiContainer.current?.appendChild(pixiApp.view as HTMLCanvasElement);
    setApp(pixiApp);

    return () => {
      if (app) {
        app.destroy(true, true);
        pixiContainer.current?.removeChild(app.view as HTMLCanvasElement);

        setApp(null);
        setAnimationList([]);
      }
    };
  }, []);

  useEffect(() => {
    if (app) {
      app.renderer.background.color = new Color(appSettings.backgroundColor);
      app.renderer.background.alpha = appSettings.backgroundAlpha;
    }
  }, [appSettings]);

  useEffect(() => {
    if (app && newFile) {
      handleFileUpdate(app, newFile);
    }
  }, [newFile]);

  const handleFileUpdate = (app: Application, file: FileMeta) => {
    if (file.method === "add") {
      addNewAnimation(app, file);
    } else if (file.method === "remove") {
      removeExistingAnimation(app, file);
    }
  };

  const addNewAnimation = async (app: Application, file: FileMeta) => {
    const animation = await addAnimation(app, file);
    if (animation) {
      setAnimationList((prev) => [...prev, animation]);
      setNewFile(null);
    }
  };

  const removeExistingAnimation = (app: Application, file: FileMeta) => {
    const updatedAnimations = removeAnimation(app, file, animationList);
    setAnimationList(updatedAnimations);
  };

  return <div ref={pixiContainer} />;
};
