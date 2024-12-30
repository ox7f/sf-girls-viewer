import type { IAnimation, Spine } from "pixi-spine";

const extractAnimationNumber = (name: string): number | null => {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const findIdleAnimation = (
  animation: Spine,
  animationNumber: number | null,
): IAnimation | undefined => {
  if (!animationNumber) {
    return animation.spineData.animations.find((anim) =>
      anim.name.toLowerCase().includes("idle"),
    );
  }

  return animation.spineData.animations.find(
    (anim) => anim.name === `Idle ${animationNumber}`,
  );
};

const setupTouchAnimation = (
  animation: Spine,
  correspondingIdleAnimation?: IAnimation,
) => {
  if (!correspondingIdleAnimation) {
    return;
  }

  animation.state.tracks[0].listener = {
    complete: () => {
      animation.state.setAnimation(0, correspondingIdleAnimation.name, true);
    },
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
  const isTouchAnimation = animationName.toLowerCase().includes("touch");

  if (!animation.state.hasAnimation(animationName)) {
    return;
  }

  animation.state.setAnimation(0, animationName, !isTouchAnimation);

  if (isTouchAnimation) {
    setupTouchAnimation(animation, correspondingIdleAnimation);
  } else if (animationName.toLowerCase().includes("idle")) {
    animation.state.setAnimation(0, animationName, true);
  }
};
