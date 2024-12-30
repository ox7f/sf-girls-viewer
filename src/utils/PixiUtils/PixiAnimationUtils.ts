import type { IAnimation, Spine } from "pixi-spine";

const extractAnimationNumber = (name: string): number | null => {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const findAnimationByName = (
  animations: IAnimation[],
  name: string,
): IAnimation | undefined =>
  animations.find((anim) =>
    anim.name.toLowerCase().includes(name.toLowerCase()),
  );

const findIdleAnimation = (
  animation: Spine,
  animationNumber: number | null,
): IAnimation | undefined => {
  const idleName = animationNumber ? `Idle ${animationNumber}` : "idle";
  return findAnimationByName(animation.spineData.animations, idleName);
};

const setupCompleteListener = (
  animation: Spine,
  idleAnimationName: string,
): void => {
  animation.state.tracks[0].listener = {
    complete: () => animation.state.setAnimation(0, idleAnimationName, true),
  };
};

export const handleTouchAnimation = (
  animation: Spine,
  animationName: string,
) => {
  const animationNumber = extractAnimationNumber(animationName);
  const correspondingIdleAnimation = findIdleAnimation(
    animation,
    animationNumber,
  );
  const isTouchAnimation = ["touch", "attack"].some((key) =>
    animationName.toLowerCase().includes(key),
  );

  if (!animation.state.hasAnimation(animationName)) {
    return;
  }

  animation.state.setAnimation(0, animationName, !isTouchAnimation);

  if (isTouchAnimation && correspondingIdleAnimation) {
    setupCompleteListener(animation, correspondingIdleAnimation.name);
  }
};
