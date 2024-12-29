import type { Container } from "pixi.js";
import type { ITrackEntry, Spine } from "pixi-spine";
import type { FileMeta } from "../types";
import { Live2DModel } from "pixi-live2d-display/cubism4";

export type ModifiedContainer = Container & {
  alphaOriginal: number;
  isDragging: boolean;
};

export type ModifiedLive2D = Live2DModel & {
  meta: FileMeta;
};

export type ModifiedSpine = Spine & {
  meta: FileMeta;
};

export type ModifiedTrackEntry = ITrackEntry & {
  animation: { name: string };
};
