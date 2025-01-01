import type { Live2DModel } from "pixi-live2d-display";
import type { Spine } from "pixi-spine";
import type { ModifiedLive2D, ModifiedSpine } from "../types";

const customSort = (arr: string[]): string[] => {
  return arr.sort((a, b) => {
    const numA = a.toLowerCase().split(" ")[1];
    const numB = b.toLowerCase().split(" ")[1];

    return parseInt(numA) - parseInt(numB);
  });
};

export const getIsLive2D = (
  animation: ModifiedLive2D | ModifiedSpine,
): boolean => animation?.meta.type === "live2d";

export const getAnimations = (
  animation: Live2DModel | Spine,
  isLive2D: boolean,
): string[] => {
  let animations = [];

  if (isLive2D) {
    animations =
      Object.keys(
        (animation as ModifiedLive2D).internalModel.motionManager.definitions,
      ) ?? [];
  } else {
    animations =
      (animation as ModifiedSpine)?.spineData?.animations.map(
        (animation) => animation.name,
      ) ?? [];
  }

  animations = animations.filter((animation) => {
    // exclude background/foreground animations
    for (const animationName of ["idle", "touch", "attack", "dead"]) {
      if (animation.toLowerCase().includes(animationName)) {
        return true;
      }
    }
    return false;
  });

  return customSort(animations);
};

export const getSkins = (
  animation: Live2DModel | Spine,
  isLive2D: boolean,
): string[] => {
  if (isLive2D) {
    return [];
  }

  return (
    (animation as Spine)?.spineData?.skins
      ?.filter((skin) => skin.name.toLowerCase() !== "default")
      .map((skin) => skin.name) ?? []
  );
};
