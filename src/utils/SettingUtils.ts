import { ModifiedLive2D, ModifiedSpine } from "../types";

const customSort = (arr: string[]): string[] => {
  return arr.sort((a, b) => {
    const [_typeA, numA] = a.toLowerCase().split(" ");
    const [_typeB, numB] = b.toLowerCase().split(" ");

    return parseInt(numA) - parseInt(numB);
  });
};

export const getIsLive2D = (
  animation: ModifiedLive2D | ModifiedSpine,
): boolean => animation?.meta.type === "live2d";

export const getAnimations = (
  animation: ModifiedLive2D | ModifiedSpine,
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
  animation: ModifiedLive2D | ModifiedSpine,
  isLive2D: boolean,
): string[] => {
  if (isLive2D) {
    return [];
  }

  return (
    (animation as ModifiedSpine)?.spineData?.skins
      ?.filter((skin) => skin.name.toLowerCase() !== "default")
      .map((skin) => skin.name) ?? []
  );
};
