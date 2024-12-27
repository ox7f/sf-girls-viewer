/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAtom } from "jotai";
import { type FC, useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { fileAtom, pixiAnimationListAtom, pixiAppAtom } from "@/atoms/atoms";
import { type FileMeta } from "@/types/FileTypes";
import {
  initializePixiApp,
  addAnimation,
  removeAnimation,
} from "@/utils/PixiUtils";

const PixiViewer: FC = () => {
  const pixiContainer = useRef<HTMLDivElement | null>(null);

  const [app, setApp] = useAtom(pixiAppAtom);
  const [newFile, setNewFile] = useAtom(fileAtom);
  const [animationList, setAnimationList] = useAtom(pixiAnimationListAtom);

  useEffect(() => {
    const pixiApp = initializePixiApp();
    pixiContainer.current?.appendChild(pixiApp.view as HTMLCanvasElement);
    setApp(pixiApp);

    return () => {
      pixiApp.destroy(true, true);
      pixiContainer.current?.removeChild(pixiApp.view as HTMLCanvasElement);

      setApp(null);
      setAnimationList([]);
    };
  }, []);

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

export default PixiViewer;
