import {
  type FederatedMouseEvent,
  Application,
  Assets,
  Container,
  Sprite,
  Ticker,
} from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";
import { type ISkeletonData, Spine } from "pixi-spine";
import { handleTouchAnimation } from "./AnimationUtils";
import type {
  ModifiedContainer,
  ModifiedSpine,
  FileMeta,
  ModifiedTrackEntry,
  ModifiedLive2D,
} from "../types";

// TODO: scale should come from config file or mapper?
// => something like a map that returns an offset for the entity?
// or maybe just resize the background files so it fits the spine?
// or calculate scale by width and height of spine to fit view + background/foreground?
const DEFAULT_SCALE = 0.3;

// TODO fix error for Chihiro Spine Skin1, Irina Spine Skin1, Riho X Spine Skin 1, Yukako X Playroom Skin1, Zi Long Spine
// Uncaught (in promise) Error: Texture Error: frame does not fit inside the base Texture dimensions: X: 2 + 1750 = 1752 > 1024 and Y: 140 + 1612 = 1752 > 1024

const addLive2D = async (
  app: Application,
  file: FileMeta,
): Promise<ModifiedLive2D | undefined> => {
  try {
    const model = (await Live2DModel.from(`/${file.config.fileName}`, {
      ticker: Ticker.shared,
      idleMotionGroup: "Idle 1",
    })) as ModifiedLive2D;

    model.scale.set(DEFAULT_SCALE);
    model.meta = file;

    const container = createContainer() as ModifiedContainer;
    app.stage.addChild(container);

    if (file.config.background) {
      addSprite(file.config.background, container);
    }
    container.addChild(model);

    if (file.config.foreground) {
      addSprite(file.config.foreground, container);
    }

    centerContainer(container, app);
    setupInteractionEvents(container, model);

    return model;
  } catch (error) {
    console.error("Error loading Live2D:", { error, file });
  }
};

const addSpine = async (
  app: Application,
  file: FileMeta,
): Promise<ModifiedSpine | undefined> => {
  try {
    const { spineData } = await Assets.load(`/${file.config.fileName}`);

    if (!spineData) {
      throw new Error("Invalid Spine data");
    }

    const container = createContainer() as ModifiedContainer;
    app.stage.addChild(container);

    const animation = createSpineAnimation(spineData) as ModifiedSpine;
    animation.meta = file;

    if (file.config.background) {
      addSprite(file.config.background, container);
    }

    if (file.config.addition) {
      const { spineData: spineDataAddition } = await Assets.load(
        `/${file.config.addition}`,
      );
      const additionalAnimation = createSpineAnimation(
        spineDataAddition,
      ) as ModifiedSpine;
      setupSpineClickEvents(container, additionalAnimation);
      container.addChild(additionalAnimation);
    }

    container.addChild(animation);

    if (file.config.foreground) {
      addSprite(file.config.foreground, container);
    }

    centerContainer(container, app);
    setupInteractionEvents(container, animation);

    return animation;
  } catch (error) {
    console.error("Error loading Spine:", { error, file });
  }
};

const createContainer = (): Container => {
  const container = new Container();
  container.eventMode = "dynamic";
  return container;
};

const centerContainer = (container: Container, app: Application) => {
  const bounds = container.getLocalBounds();

  container.pivot.set(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );

  container.position.set(app.screen.width / 2, app.screen.height / 2);
};

const createSpineAnimation = (
  data: ISkeletonData,
  scale: number = DEFAULT_SCALE,
): Spine => {
  const animation = new Spine(data);
  animation.scale.set(scale);

  const { spineData } = animation;
  const firstIdleAnimationName = spineData.animations.find((animation) =>
    animation.name.includes("Idle"),
  );
  const firstSkin = spineData.skins[1] ?? spineData.skins[0];

  if (firstIdleAnimationName) {
    animation.state.setAnimation(0, firstIdleAnimationName.name, true);
  }

  if (firstSkin) {
    animation.skeleton.setSkinByName(firstSkin.name);
  }

  return animation;
};

const addSprite = (path: string, container: Container) => {
  const sprite = Sprite.from(path);
  sprite.anchor.set(0.5, 0.5);
  container.addChild(sprite);
};

const setupInteractionEvents = (
  container: ModifiedContainer,
  animation: ModifiedSpine | ModifiedLive2D,
) => {
  const isLive2D = animation.meta.config.fileName?.includes(".model3.json");
  if (isLive2D) {
    setupLive2DClickEvents(animation as ModifiedLive2D);
  } else {
    setupSpineClickEvents(container, animation as ModifiedSpine);
  }
  setupDragEvents(container);
  setupScrollEvents(container);
};

const setupLive2DClickEvents = (model: ModifiedLive2D): void => {
  // like spine => currentAnimation and then replace Idle with Touch

  model.on("pointerdown", () => {
    const currentAnimationName =
      model.internalModel.motionManager.state.currentGroup;
    const newAnimationName = currentAnimationName?.replace("Idle", "Touch");

    if (newAnimationName) {
      model.motion(newAnimationName);
    }
  });
};

const setupSpineClickEvents = (
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
    // dragTarget.alphaOriginal = dragTarget.alpha;
    // dragTarget.alpha = 0.75;
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
      // dragTarget.alpha = dragTarget.alphaOriginal;
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

export const addAnimation = async (app: Application, file: FileMeta) => {
  return file.type === "live2d"
    ? await addLive2D(app, file)
    : file.type === "spine"
      ? await addSpine(app, file)
      : console.warn(`Unsupported file type: ${file.type}`);
};

export const removeAnimation = (
  app: Application,
  file: FileMeta,
  animationList: Array<ModifiedLive2D | ModifiedSpine>,
) =>
  animationList
    .filter((animation) => {
      const matches =
        animation.meta.config.fileName === file.config.fileName &&
        animation.meta.index === file.index;

      if (matches) {
        const container = animation.parent;
        app.stage.removeChild(container);
        container.destroy();
      }

      return !matches;
    })
    .map((animation, index) => {
      animation.meta.index = index;
      return animation;
    });

export const initializePixiApp = (): Application =>
  new Application({
    resizeTo: window,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
