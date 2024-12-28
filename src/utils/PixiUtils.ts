import {
  type FederatedMouseEvent,
  Application,
  Assets,
  Container,
  Sprite,
} from "pixi.js";
import { type ISkeletonData, type ITrackEntry, Spine } from "pixi-spine";
import { ModifiedContainer, ModifiedSpine, FileMeta } from "@/types";

const addLive2D = async (
  app: Application,
  file: FileMeta,
): Promise<undefined> => {
  console.log("TODO: Implement Live2D support", { app, file });
};

const addSpine = async (
  app: Application,
  file: FileMeta,
): Promise<ModifiedSpine | undefined> => {
  try {
    const { spineData } = await Assets.load(`/${file.config.fileName}`);

    if (!spineData) {
      console.error("Invalid Spine data.");
      return;
    }

    const container = createContainer() as ModifiedContainer;
    // TODO: scale should come from config file or mapper?
    const animation = createSpineAnimation(spineData, 0.35) as ModifiedSpine;

    animation.meta = file;

    if (file.config.addition) {
      addAdditionalSpine(container, file.config.addition);
    }

    if (file.config.background) {
      addBackground(container, file.config.background);
    }

    if (file.config.foreground) {
      addForeground(container, file.config.foreground);
    }

    container.addChild(animation);
    app.stage.addChild(container);

    setupInteractionEvents(container, animation);

    return animation;
  } catch (error) {
    console.error("Error loading Spine:", { error, file });
  }
  return;
};

const createContainer = (): Container => {
  const container = new Container();

  container.eventMode = "dynamic";
  container.position.set(window.innerWidth / 2, window.innerHeight / 2);

  return container;
};

const createSpineAnimation = (
  spineData: ISkeletonData,
  scale: number,
): Spine => {
  const animation = new Spine(spineData);
  animation.scale.set(scale);

  const firstAnimationName = animation.spineData.animations[0];

  if (firstAnimationName) {
    animation.state.setAnimation(0, firstAnimationName.name, true);
    animation.state.timeScale = 1;
    animation.autoUpdate = true;
  }

  return animation;
};

const addAdditionalSpine = async (
  container: ModifiedContainer,
  additionalPath: string,
) => {
  console.log("TODO: implement me", additionalPath, container);
};

const addBackground = (
  container: ModifiedContainer,
  backgroundPath: string,
) => {
  const background = Sprite.from(backgroundPath);

  background.anchor.set(0.5);
  background.position.set(container.width / 2, container.height / 2);

  container.addChild(background);
};

const addForeground = (
  container: ModifiedContainer,
  foregroundPath: string,
) => {
  const foreground = Sprite.from(foregroundPath);

  foreground.anchor.set(0.5);
  foreground.position.set(container.width / 2, container.height / 2);

  container.addChild(foreground);
};

const setupInteractionEvents = (
  container: ModifiedContainer,
  animation: ModifiedSpine,
) => {
  setupClickEvents(container, animation);
  setupDragEvents(container);
  setupScrollEvents(container);
};

const setupClickEvents = (
  container: Container,
  animation: ModifiedSpine,
): void => {
  const onTouch = () => {
    const currentAnimationName = (
      animation.state.tracks[0] as ITrackEntry & { animation: { name: string } }
    ).animation.name;

    const idleAnimationName = currentAnimationName.replace("Touch", "Idle");
    const touchAnimationName = currentAnimationName.replace("Idle", "Touch");

    animation.state.setAnimation(0, touchAnimationName, false);
    animation.state.addAnimation(0, idleAnimationName, true, 0);
  };

  container.on("click", onTouch);
};

const setupDragEvents = (container: ModifiedContainer): void => {
  let dragTarget: ModifiedContainer | null = null;

  const onDragStart = (event: FederatedMouseEvent) => {
    dragTarget = container;
    dragTarget.alphaOriginal = dragTarget.alpha;
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
      dragTarget.alpha = dragTarget.alphaOriginal;
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
  switch (file.type) {
    case "live2d":
      return await addLive2D(app, file);
    case "spine":
      return await addSpine(app, file);
    default:
      console.warn(`Unsupported file type: ${file.type}`);
      return;
  }
};

export const removeAnimation = (
  app: Application,
  file: FileMeta,
  animationList: ModifiedSpine[],
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
