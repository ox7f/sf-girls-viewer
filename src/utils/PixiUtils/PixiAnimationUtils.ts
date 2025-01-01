import type { ModifiedLive2D, ModifiedSpine } from "../../types";

const extractAnimationNumber = (name: string): number | null => {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const extractAnimationExtension = (name: string): string | undefined => {
  return name.split(" ").pop();
};

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

const setupCompleteListener = (
  animation: ModifiedSpine,
  idleAnimationName: string,
): void => {
  animation.state.tracks[0].listener = {
    complete: () => animation.state.setAnimation(0, idleAnimationName, true),
  };
};

const setupCompleteListener2 = (
  animation: ModifiedLive2D,
  idleAnimationName: string,
): void => {
  animation.internalModel.motionManager.groups.idle = idleAnimationName;
};

export const getTouchAnimationName = (
  animationName?: string,
  isChibi = false,
): string | undefined =>
  animationName?.toLowerCase().replace("idle", isChibi ? "attack" : "Touch");

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

  const isTouchAnimation = ["touch", "attack", "dead"].some((key) =>
    animationName.toLowerCase().includes(key),
  );

  if (animationNames.includes(animationName)) {
    animation.internalModel.motionManager.stopAllMotions();
    animation.motion(animationName);

    if (isTouchAnimation && correspondingIdleAnimation) {
      setupCompleteListener2(animation, correspondingIdleAnimation);
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

  const isTouchAnimation = ["touch", "attack", "dead"].some((key) =>
    animationName.toLowerCase().includes(key),
  );

  if (animation.state.hasAnimation(animationName)) {
    animation.state.setAnimation(0, animationName, !isTouchAnimation);

    if (isTouchAnimation && correspondingIdleAnimation) {
      setupCompleteListener(animation, correspondingIdleAnimation);
    }
  }
};
