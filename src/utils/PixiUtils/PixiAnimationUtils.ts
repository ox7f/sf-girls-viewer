import type { Live2DModel } from "pixi-live2d-display/cubism4";
import type { ModifiedLive2D, ModifiedSpine } from "../../types";

const extractAnimationNumber = (name: string): number | null => {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const extractAnimationExtension = (name: string): string | undefined =>
  name.match(/\d+\s*(.*)/)?.[1];

const findAnimationByName = (
  animationNames: string[],
  name: string,
): string | undefined =>
  animationNames.find((animationName) =>
    animationName.toLowerCase().includes(name.toLowerCase()),
  );

const findIdleAnimation = (
  animationNames: string[],
  animationNumber: number | null,
  animationExtension?: string,
): string | undefined => {
  const idleName = animationNumber
    ? `Idle ${animationNumber}${animationExtension ? ` ${animationExtension}` : ""}`
    : "idle";
  return findAnimationByName(animationNames, idleName);
};

const setupCompleteListenerSpine = (
  animation: ModifiedSpine,
  idleAnimationName: string,
): void => {
  animation.state.tracks[0].listener = {
    complete: () => animation.state.setAnimation(0, idleAnimationName, true),
  };
};

const setupCompleteListenerLive2D = (
  animation: ModifiedLive2D,
  idleAnimationName: string,
): void => {
  animation.internalModel.motionManager.groups.idle = idleAnimationName;
};

export const getTouchAnimationName = (
  animationName?: string,
  isChibi = false,
): string | undefined =>
  isChibi
    ? animationName?.replace("idle", "attack")
    : animationName?.replace("Idle", "Touch");

export const handleTouchAnimationLive2D = (
  animation: ModifiedLive2D,
  animationName: string,
): void => {
  const animationNames = Object.keys(
    animation.internalModel.motionManager.definitions,
  );

  const animationNumber = extractAnimationNumber(animationName);
  const animationExtension = extractAnimationExtension(animationName);
  const correspondingIdleAnimation = findIdleAnimation(
    animationNames,
    animationNumber,
    animationExtension,
  );

  const isTouchAnimation = ["action", "touch", "attack", "dead"].some((key) =>
    animationName.toLowerCase().includes(key),
  );

  if (animationNames.includes(animationName)) {
    animation.internalModel.motionManager.stopAllMotions();
    animation.motion(animationName);

    if (isTouchAnimation && correspondingIdleAnimation) {
      setupCompleteListenerLive2D(animation, correspondingIdleAnimation);
    }
  }
};

export const handleTouchAnimationSpine = (
  animation: ModifiedSpine,
  animationName: string,
): void => {
  const animationNames = animation.spineData.animations.map(
    (animation) => animation.name,
  );

  const animationNumber = extractAnimationNumber(animationName);
  const animationExtension = extractAnimationExtension(animationName);
  const correspondingIdleAnimation = findIdleAnimation(
    animationNames,
    animationNumber,
    animationExtension,
  );

  const isTouchAnimation = ["action", "touch", "attack", "dead"].some((key) =>
    animationName.toLowerCase().includes(key),
  );

  if (animation.state.hasAnimation(animationName)) {
    animation.state.setAnimation(0, animationName, !isTouchAnimation);

    if (isTouchAnimation && correspondingIdleAnimation) {
      setupCompleteListenerSpine(animation, correspondingIdleAnimation);
    }
  }
};

export const playFirstLive2DAnimation = (animation: Live2DModel) => {
  const firstIdleAnimationName = Object.keys(
    animation.internalModel.motionManager.definitions,
  ).find((animationName) => animationName.toLowerCase().includes("idle"));

  if (firstIdleAnimationName) {
    animation.internalModel.motionManager.groups.idle = firstIdleAnimationName;
  }
};
