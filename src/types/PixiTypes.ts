import type { Container } from "pixi.js";
import type { ITrackEntry, Spine } from "pixi-spine";
import type { FileMeta } from "@/types";

export type ModifiedSpine = Spine & {
  meta: FileMeta;
};

export type ModifiedContainer = Container & {
  alphaOriginal: number;
  isDragging: boolean;
};

export type ModifiedTrackEntry = ITrackEntry & {
  animation: { name: string };
};
