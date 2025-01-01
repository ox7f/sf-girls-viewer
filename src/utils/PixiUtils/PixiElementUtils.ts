import { Application, Container, Sprite } from "pixi.js";
import type { ModifiedLive2D, ModifiedSpine } from "../../types";

type SceneStyleOptions = {
  angle?: number;
  scale?: number;
  skew?: number;
  x?: number;
  y?: number;
};

type SceneStyleType = {
  [key: string]: SceneStyleOptions;
};

const DEFAULT_SCALE = 0.3;
const SCENE_STYLE: SceneStyleType = {
  Akina_Playroom_Skin1: { scale: 0.11 },
  Aoi_Playroom_Skin2: { scale: 0.11, y: 160 },
  Aoi_Playroom_Wedding: { scale: 0.12, y: 5 },
  Ari_Playroom_Wedding: { scale: 0.121, x: 7, y: 4 },
  Ayu_Playroom_Wedding: { scale: 0.11 },
  Bia_Playroom_Skin1: { scale: 0.1, x: 10, y: -20 },
  Cadence_Playroom_Skin1: { scale: 0.13, x: 25, y: 10 },
  Chihiro_Playroom_Skin1: { scale: 0.11, y: 10 },
  Coco_Playroom_Skin2: { scale: 0.11, y: 155 },
  Denka_Playroom_Wedding: { scale: 0.11, x: 10 },
  Eiko_Playroom_Wedding: { scale: 0.2, x: 20, y: 360 },
  Ember_X_Playroom_Skin1: { scale: 0.25, x: -620, y: -507 },
  Gai_gai_Playroom_Skin1: { scale: 0.1, x: 15, y: 160 },
  Goi_Playroom_Skin1: { scale: 0.1, y: 120 },
  Hami_Playroom_Skin1: { angle: 270, scale: 0.21 },
  Hitomi_Playroom_Skin2: { scale: 0.12 },
  Hitomi_Playroom_Wedding: { scale: 0.12 },
  Irina_Playroom_Skin1: { scale: 0.11, x: -35 },
  Irina_Playroom_Wedding: { scale: 0.13, x: 15 },
  Kiyomi_Playroom_Skin2: { scale: 0.13, x: 10, y: 180 },
  Kura_Playroom_Skin1: { scale: 0.1, x: 10 },
  Kura_Playroom_Skin2: { scale: 0.13 },
  Livia_Playroom_Wedding: { scale: 0.12, x: -300, y: -175 },
  Mai_Playroom_Eri: { scale: 0.1, x: 80, y: 155 },
  Mai_Playroom_Skin1: { scale: 0.12 },
  Mai_Playroom_Wedding: { scale: 0.17, x: 10, y: 270 },
  Midori_Playroom_Skin1: { scale: 0.13, x: -20, y: 200 },
  Mika_Playroom_Wedding: { scale: 0.12 },
  Mitsu_Playroom_Skin1: { scale: 0.13, x: -310, y: 300 },
  Momoko_Playroom_Wedding: { scale: 0.13, y: 90 },
  Musuna_Playroom_Wedding: { scale: 0.13, y: -5 },
  Neve_X_Playroom_Skin1: { scale: 0.11, x: -25, y: -30 },
  Neve_X_Playroom_Wedding: { scale: 0.11, x: -80, y: 190 },
  Noa_Playroom_Skin3: { scale: 0.11, y: 180 },
  Noa_Playroom_Wedding: { scale: 0.14, x: -215, y: -305 },
  O_Playroom_Wedding: { scale: 0.12, y: 200 },
  Pan_Playroom_Skin1: { scale: 0.12 },
  Rei_Playroom_Wedding: { scale: 0.25, x: -20, y: 310 },
  Rei_Spine_Skin1: { scale: 0.5 },
  Rei_JK_Playroom_Skin1: { scale: 0.11 },
  Reika_Playroom_Skin1: { scale: 0.12, x: 20, y: 17 },
  Reika_Playroom_Wedding: { scale: 0.13 },
  Riho_Playroom_Skin1: { scale: 0.1 },
  Riho_Spine_Skin1_Addition: { angle: 90, skew: 1, x: 40, y: 100 },
  Riho_X_Playroom_Wedding: { scale: 0.1 },
  Rosalie_Playroom_Skin1: { scale: 0.13 },
  Rui_Playroom: { scale: 0.12, x: -15, y: 5 },
  Sara_Playroom_Skin1: { scale: 0.09, x: -280, y: 155 },
  Sayaka_Playroom_Skin1: { scale: 0.11, x: -40 },
  Sayaka_Playroom_Wedding: { scale: 0.12, y: 135 },
  Setsuna_Playroom_Skin2: { scale: 0.11 },
  Shiko_Playroom_Skin1: { scale: 0.12, y: 180 },
  Sizuko_Playroom_Skin3: { scale: 0.13, y: 190 },
  Toki_Playroom_Skin1: { scale: 0.11 },
  Tsukiko_Playroom_Wedding: { scale: 0.12 },
  Uni_Playroom_Skin2: { scale: 0.13, x: 10, y: 185 },
  Uzu_Playroom_Skin1: { scale: 0.11, y: 140 },
  Vanessa_Playroom_Skin2: { scale: 0.14, y: 250 },
  Victoria_Playroom_Skin1: { scale: 0.12 },
  Wu_Playroom_Skin1: { scale: 0.09, x: -320, y: -230 },
  Yuuha_Playroom_Skin2: { scale: 0.11 },
  Zi_Long_Spine_Skin1_Addition: { scale: 0.12, y: 100 },
  Zi_Long_Playroom_Skin1: { scale: 0.13 },
  Gaia_Playroom_A: { scale: 0.1, x: 25 },
  Gaia_Playroom_B: { scale: 0.1, x: 30 },
  Gaia_Playroom_C: { scale: 0.1 },
  Hestia_Playroom_A: { scale: 0.12 },
  Hestia_Playroom_B: { scale: 0.12 },
  Hestia_Playroom_C: { scale: 0.11 },
  Selene_Playroom_A: { scale: 0.11 },
  Selene_Playroom_B: { scale: 0.11 },
  Selene_Playroom_C: { scale: 0.11 },
};

export const setAnimationStyle = (
  element: ModifiedLive2D | ModifiedSpine | Sprite,
  name: string = "",
): void => {
  element.scale.set(DEFAULT_SCALE);

  if (Object.keys(SCENE_STYLE).includes(name)) {
    const style = SCENE_STYLE[name] as SceneStyleOptions;

    if (style.angle) {
      element.angle = style.angle;
    }

    if (style.scale) {
      element.scale.set(style.scale);
    }

    if (style.skew) {
      element.skew.set(style.skew * Math.PI - Math.PI / 2);
    }

    if (style.x) {
      element.x = style.x;
    }

    if (style.y) {
      element.y = style.y;
    }

    if (style.y) {
      element.y = style.y;
    }
  }

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
    resizeTo: window,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
