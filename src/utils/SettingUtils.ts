import { ModifiedLive2D, ModifiedSpine } from "../types";

export const getIsLive2D = (animation: ModifiedLive2D | ModifiedSpine) =>
  animation?.meta.type === "live2d";

export const getAnimations = (
  animation: ModifiedLive2D | ModifiedSpine,
  isLive2D: boolean,
): string[] => {
  if (isLive2D) {
    return (
      Object.keys(
        (animation as ModifiedLive2D).internalModel.motionManager.definitions,
      ) ?? []
    );
  }

  return (
    (animation as ModifiedSpine)?.spineData?.animations.map(
      (animation) => animation.name,
    ) ?? []
  );
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
