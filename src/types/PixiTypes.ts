import type { Spine } from "pixi-spine";
import type { FileMeta } from "@/types/FileTypes";
import { Container } from "pixi.js";

export type ModifiedSpine = Spine & {
  meta: FileMeta;
};

export type ModifiedContainer = Container & {
  alphaOriginal: number;
  isDragging: boolean;
};
