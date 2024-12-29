import type { IAnimation, Spine } from "pixi-spine";

export const extractAnimationNumber = (name: string): number | null => {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export const findIdleAnimation = (
  animation: Spine,
  animationNumber: number | null,
): IAnimation | undefined => {
  if (!animationNumber) {
    return;
  }

  return animation.spineData.animations.find(
    (anim) => anim.name === `Idle ${animationNumber}`,
  );
};

export const handleTouchAnimation = (
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
