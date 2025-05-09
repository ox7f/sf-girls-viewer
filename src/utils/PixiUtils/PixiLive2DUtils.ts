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

    return animation;
  } catch (error) {
    console.error("Error loading Live2D:", { error, file });
  }
};
