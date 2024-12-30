import { Application, Container, Sprite } from "pixi.js";

export const DEFAULT_SCALE = 0.3;

export const addSprite = (path: string, container: Container) => {
  const sprite = Sprite.from(path);
  sprite.anchor.set(0.5);
  container.addChild(sprite);
};

export const createContainer = (): Container => {
  const container = new Container();
  container.eventMode = "dynamic";
  return container;
};

export const centerContainer = (container: Container, app: Application) => {
  const bounds = container.getLocalBounds();
  container.pivot.set(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  container.position.set(app.screen.width / 2, app.screen.height / 2);
};

export const initializePixiApp = (): Application =>
  new Application({
    resizeTo: window,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
