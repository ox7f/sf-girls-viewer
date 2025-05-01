import { Application, Container, Sprite } from "pixi.js";
import type { ModifiedLive2D, ModifiedSpine } from "../../types";

const getBufferFactor = (width: number) => {
  if (width > 3500) return 0.9;
  if (width > 2000) return 0.85;
  if (width > 1500) return 0.75;
  if (width > 1000) return 0.65;
  return 0.95;
};

const calculateScaleFactor = (
  bounds: { width: number; height: number },
  viewportWidth: number,
  viewportHeight: number,
) => {
  let skeletonWidth = bounds.width;
  let skeletonHeight = bounds.height;

  if (skeletonWidth <= 1 || skeletonHeight <= 1) {
    console.warn("Invalid skeleton bounds, using fallback dimensions.");
    skeletonWidth = 1024;
    skeletonHeight = 1024;
  }

  let scaleFactor = Math.min(
    viewportWidth / skeletonWidth,
    viewportHeight / skeletonHeight,
  );

  scaleFactor *= getBufferFactor(skeletonWidth);
  return Math.abs(scaleFactor);
};

export const setAnimationStyle = (
  element: ModifiedLive2D | ModifiedSpine | Sprite,
): void => {
  let { height, width } = element.getLocalBounds();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (width <= 1 || height <= 1) {
    width = (element as Sprite)._texture.baseTexture.height;
    height = (element as Sprite)._texture.baseTexture.width;
  }

  // Calculate scale
  const scaleFactor = calculateScaleFactor(
    { height, width },
    viewportWidth,
    viewportHeight,
  );

  element.scale.set(scaleFactor);

  if ("anchor" in element && element.anchor.set) {
    element.anchor.set(0.5);
  }
};

export const addSprite = (path: string, container: Container): void => {
  const sprite = Sprite.from(path);
  setAnimationStyle(sprite);
  container.addChild(sprite);
};

export const createContainer = (): Container => {
  const container = new Container();
  container.eventMode = "dynamic";
  return container;
};

export const centerContainer = (
  container: Container,
  app: Application,
): void => {
  const bounds = container.getLocalBounds();
  container.pivot.set(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  container.position.set(app.screen.width / 2, app.screen.height / 2);
};

export const initializePixiApp = (): Application =>
  new Application({
    resizeTo: document.getElementById("app")!,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio ?? 1,
    autoDensity: true,
  });
