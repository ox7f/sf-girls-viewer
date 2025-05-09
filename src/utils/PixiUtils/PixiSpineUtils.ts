import { Application, Assets } from "pixi.js";
import { ISkeletonData, Spine } from "pixi-spine";
import {
  addSprite,
  centerContainer,
  createContainer,
  setAnimationStyle,
} from "./PixiElementUtils";
import {
  setupInteractionEvents,
  setupSpineClickEvents,
} from "./PixiEventUtils";
import type { FileMeta, ModifiedContainer, ModifiedSpine } from "../../types";

const createSpineAnimation = (data: ISkeletonData): Spine => {
  const animation = new Spine(data);

  const { spineData } = animation;
  const firstSkin = spineData.skins[1] ?? spineData.skins[0];
  const firstIdleAnimationName = spineData.animations.find((animation) =>
    animation.name.toLowerCase().includes("idle"),
  );

  if (firstSkin) {
    animation.skeleton.setSkinByName(firstSkin.name);
  }

  if (firstIdleAnimationName) {
    animation.state.setAnimation(0, firstIdleAnimationName.name, true);
  }

  return animation;
};

const loadAndSetupSpine = async (
  path: string,
  file: FileMeta,
  isAdditional: boolean = false,
): Promise<ModifiedSpine | undefined> => {
  try {
    const { spineData } = await Assets.load(path);

    if (!spineData) {
      throw new Error(`Invalid Spine data at ${path}`);
    }

    const animation = createSpineAnimation(spineData) as ModifiedSpine;

    if (!isAdditional) {
      animation.meta = file;
    }

    setAnimationStyle(animation);

    return animation;
  } catch (error) {
    console.error(`Error loading Spine from ${path}:`, error);
  }
};

export const addSpine = async (
  app: Application,
  file: FileMeta,
): Promise<ModifiedSpine | undefined> => {
  try {
    const filePath = `/${file.config.fileName}`;
    const animation = await loadAndSetupSpine(filePath, file);

    if (!animation) {
      throw new Error("Invalid Spine data for animation");
    }

    const container = createContainer() as ModifiedContainer;
    app.stage.addChild(container);

    if (file.config.addition) {
      const additionalFilePath = `/${file.config.addition}`;
      const additionalAnimation = await loadAndSetupSpine(
        additionalFilePath,
        file,
        true,
      );

      if (additionalAnimation) {
        setupSpineClickEvents(container, additionalAnimation);
        container.addChild(additionalAnimation);
      }
    }

    // TODO: Yukako Playroom Skin 2 + Rei Playroom Wedding => Background/Foreground is an animation...
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
    console.error("Error loading Spine:", { error, file });
  }
};
