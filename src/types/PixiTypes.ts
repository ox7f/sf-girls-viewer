import type { Container } from "pixi.js";
import type { Live2DModel } from "pixi-live2d-display/cubism4";
import type { ITrackEntry, Spine } from "pixi-spine";
import type { FileMeta } from "../types";

export type ModifiedContainer = Container & {
  allowClick?: boolean;
  allowDrag?: boolean;
  isDragging?: boolean;
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
