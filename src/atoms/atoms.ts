import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Application } from "pixi.js";
import type {
  DropdownSelection,
  EntityMap,
  FileMeta,
  ModifiedSpine,
  SettingsGlobal,
} from "@/types";
import { menuItems } from "@/utils";

export const pixiAppAtom = atom<Application | null>(null);
export const pixiAppSettingsGlobalAtom = atomWithStorage<SettingsGlobal>(
  "settings-global",
  {
    backgroundAlpha: 0,
    backgroundColor: "#000000",
  },
);
export const pixiAnimationListAtom = atom<ModifiedSpine[]>([]);
export const dropdownSelectionAtom = atom<DropdownSelection>({
  entity: null,
  scene: null,
});
export const fileAtom = atom<FileMeta | null>(null);
export const entityMapAtom = atom<EntityMap | null>(null);
export const selectedMenuTabAtom = atom<string | number>(menuItems[0]);
