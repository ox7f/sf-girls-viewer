import { Container, type FederatedMouseEvent } from "pixi.js";
import { handleTouchAnimation } from "./PixiAnimationUtils";
import type {
  ModifiedContainer,
  ModifiedSpine,
  ModifiedLive2D,
  ModifiedTrackEntry,
} from "../../types";

export const setupLive2DClickEvents = (model: ModifiedLive2D): void => {
  model.on("pointerdown", () => {
    const currentAnimationName =
      model.internalModel.motionManager.state.currentGroup;
    const newAnimationName = currentAnimationName?.replace("Idle", "Touch");

    if (newAnimationName) {
      model.motion(newAnimationName);
    }
  });
};

export const setupSpineClickEvents = (
  container: Container,
  animation: ModifiedSpine,
): void => {
  const onTouch = () => {
    const currentAnimation = animation.state.tracks[0] as ModifiedTrackEntry;
    const currentAnimationName = currentAnimation.animation.name;
    const touchAnimationName = currentAnimationName.replace("Idle", "Touch");
    handleTouchAnimation(animation, touchAnimationName);
  };

  container.on("click", onTouch);
};

const setupDragEvents = (container: ModifiedContainer): void => {
  let dragTarget: ModifiedContainer | null = null;

  const onDragStart = (event: FederatedMouseEvent) => {
    dragTarget = container;
    dragTarget.isDragging = true;

    const position = event.getLocalPosition(container);
    dragTarget.pivot.set(position.x, position.y);
    dragTarget.position.set(event.global.x, event.global.y);

    container.on("pointermove", onDragMove);
  };

  const onDragMove = (event: FederatedMouseEvent) => {
    if (dragTarget?.isDragging) {
      dragTarget.x = event.global.x;
      dragTarget.y = event.global.y;
    }
  };

  const onDragEnd = () => {
    if (dragTarget) {
      dragTarget.isDragging = false;
      dragTarget = null;
      container.off("pointermove", onDragMove);
    }
  };

  container
    .on("pointermove", onDragMove)
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd);
};

const setupScrollEvents = (container: ModifiedContainer): (() => void) => {
  const onWheel = (event: WheelEvent) => {
    // TODO: prevent scroll on document.body?
    return;
    event.preventDefault();
    event.stopPropagation();

    const scaleChange =
      event.deltaY < 0 ? container.scale.x + 0.05 : container.scale.x - 0.05;
    container.scale.set(scaleChange);
  };

  container.addEventListener("wheel", onWheel, { passive: false });

  return () => container.removeEventListener("wheel", onWheel);
};

export const setupInteractionEvents = (
  container: ModifiedContainer,
  animation: ModifiedSpine | ModifiedLive2D,
) => {
  if (animation.meta.type === "live2d") {
    setupLive2DClickEvents(animation as ModifiedLive2D);
  } else {
    setupSpineClickEvents(container, animation as ModifiedSpine);
  }

  setupDragEvents(container);
  setupScrollEvents(container);
};
