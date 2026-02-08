import { Application, Ticker } from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";
import {
  addSprite,
  centerContainer,
  createContainer,
  setAnimationStyle,
} from "./PixiElementUtils";
import { setupInteractionEvents } from "./PixiEventUtils";
import { playFirstLive2DAnimation } from "./PixiAnimationUtils";
import { FileMeta, ModifiedContainer, ModifiedLive2D } from "../../types";

const loadAndSetupLive2D = async (
  path: string,
  file: FileMeta,
  isAdditional: boolean = false,
): Promise<ModifiedLive2D | undefined> => {
  try {
    const filePath = `/${file.config.fileName}`;
    const modelOptions = { ticker: Ticker.shared };

    const animation = (await Live2DModel.from(
      filePath,
      modelOptions,
    )) as ModifiedLive2D;

    if (!animation) {
      throw new Error(`Invalid Live2D data at ${path}`);
    }

    if (!isAdditional) {
      animation.meta = file;
    }

    setAnimationStyle(animation);
    playFirstLive2DAnimation(animation);

    return animation;
  } catch (error) {
    console.error(`Error loading Live2DModel from ${path}:`, error);
  }
};

export const addLive2D = async (
  app: Application,
  file: FileMeta,
): Promise<ModifiedLive2D | undefined> => {
  try {
    const animation = await loadAndSetupLive2D(
      `/${file.config.fileName}`,
      file,
    );

    if (!animation) {
      throw new Error("Invalid Live2DModel");
    }

    const container = createContainer() as ModifiedContainer;
    app.stage.addChild(container);

    if (file.config.background) {
      addSprite(file.config.background, container);
    }

    container.addChild(animation);

    if (file.config.foreground) {
      addSprite(file.config.foreground, container);
    }

    centerContainer(container, app);
    setupInteractionEvents(container, animation);

    // Force an initial render to ensure renderer internals (like the
    // clipping manager used by Live2D) are initialized. Some Live2D models
    // throw on their first update if the renderer hasn't prepared these
    // structures yet
    try {
      app.render();
      animation.update(0); // also trigger an update to initialize Live2D internals that run on the first update call
      // Attempt to start the preferred idle motion after a short delay so the
      // renderer and internal motion manager are fully ready.
      try {
        const preferred = playFirstLive2DAnimation(animation);
        if (preferred) {
          setTimeout(() => {
            try {
              (animation as any).motion(preferred);
            } catch (e) {
              console.warn("Failed to start Live2D motion:", e);
            }
          }, 50);
        }
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      // ignore render failures — the ticker will still try later
      console.warn("Initial PIXI render failed:", e);
    }

    return animation;
  } catch (error) {
    console.error("Error loading Live2D:", { error, file });
  }
};
