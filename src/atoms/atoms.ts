import { atom } from "jotai";
import type { Application } from "pixi.js";
import type { EntityMap, FileMeta, ModifiedSpine } from "@/types";
import { menuItems } from "@/utils";

export const pixiAppAtom = atom<Application | null>(null);
export const pixiAnimationListAtom = atom<ModifiedSpine[]>([]);
export const fileAtom = atom<FileMeta | null>(null);
export const entityMapAtom = atom<EntityMap | null>(null);
export const selectedMenuTabAtom = atom<string | number>(menuItems[0]);
