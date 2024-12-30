import { Application, Ticker } from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";
import {
  addSprite,
  centerContainer,
  createContainer,
  DEFAULT_SCALE,
} from "./PixiElementUtils";
import { setupInteractionEvents } from "./PixiEventUtils";
import { FileMeta, ModifiedContainer, ModifiedLive2D } from "../../types";

const loadAndSetupLive2D = async (
  path: string,
  file: FileMeta,
  isAdditional: boolean = false,
): Promise<ModifiedLive2D | undefined> => {
  try {
    const filePath = `/${file.config.fileName}`;
    const modelOptions = {
      ticker: Ticker.shared,
      idleMotionGroup: "Idle 1",
    };

    const animation = (await Live2DModel.from(
      filePath,
      modelOptions,
    )) as ModifiedLive2D;

    animation.scale.set(DEFAULT_SCALE);

    if (!animation) {
      throw new Error(`Invalid Live2D data at ${path}`);
    }

    if (!isAdditional) {
      animation.meta = file;
    }

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

    return animation;
  } catch (error) {
    console.error("Error loading Live2D:", { error, file });
  }
};
