import type { FederatedMouseEvent } from "pixi.js";
import {
  getTouchAnimationName,
  handleTouchAnimationSpine,
} from "./PixiAnimationUtils";
import type {
  ModifiedContainer,
  ModifiedLive2D,
  ModifiedSpine,
  ModifiedTrackEntry,
} from "../../types";

export const setupLive2DClickEvents = (
  container: ModifiedContainer,
  animation: ModifiedLive2D,
): void => {
  animation.on("pointerdown", () => {
    if (!container.allowClick) {
      return;
    }

    const newAnimationName = getTouchAnimationName(
      animation.internalModel.motionManager.state.currentGroup,
    );

    if (newAnimationName) {
      animation.internalModel.motionManager.stopAllMotions();
      animation.motion(newAnimationName);
    }
  });
};

export const setupSpineClickEvents = (
  container: ModifiedContainer,
  animation: ModifiedSpine,
): void => {
  const onTouch = () => {
    if (!container.allowClick) {
      return;
    }

    const currentAnimationName = (
      animation.state.tracks[0] as ModifiedTrackEntry
    ).animation.name;

    const isChibi = animation.meta?.config.fileName?.includes("Chibi");
    const touchAnimationName = getTouchAnimationName(
      currentAnimationName,
      isChibi,
    );

    if (touchAnimationName) {
      handleTouchAnimationSpine(animation, touchAnimationName);
    }
  };

  container.on("pointerdown", onTouch);
};

const setupDragEvents = (container: ModifiedContainer): void => {
  let dragTarget: ModifiedContainer | null = null;

  const onDragStart = (event: FederatedMouseEvent) => {
    dragTarget = container;
    dragTarget.isDragging = Boolean(dragTarget.allowDrag);

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

const setupScrollEvents = (container: ModifiedContainer): void => {
  const onWheel = (event: WheelEvent) => {
    // TODO: prevent scroll on document.body?
    return;
    event.preventDefault();
    event.stopPropagation();

    const scaleChange =
      event.deltaY < 0 ? container.scale.x + 0.05 : container.scale.x - 0.05;
    container.scale.set(scaleChange);
  };

  container.on("wheel", onWheel);
};

export const setupInteractionEvents = (
  container: ModifiedContainer,
  animation: ModifiedSpine | ModifiedLive2D,
): void => {
  container.allowClick = true;
  container.allowDrag = true;

  if (animation.meta.type === "live2d") {
    setupLive2DClickEvents(container, animation as ModifiedLive2D);
  } else {
    setupSpineClickEvents(container, animation as ModifiedSpine);
  }

  setupDragEvents(container);
  setupScrollEvents(container);
};
