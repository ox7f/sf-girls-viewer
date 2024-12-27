export type EntityType = "Agents" | "Seekers";
export type FileType = "spine" | "live2d";

export type FileMeta = {
  config: SpineData;
  index: number;
  method: "add" | "remove";
  name: string;
  type: FileType;
};

export type SpineData = {
  name?: string;
  fileName?: string;
  background?: string;
  foreground?: string;
  addition?: string;
  // optional data for scenes like scaling?
};

export type SpineConfig = Record<string, SpineData>;

export type MiniOrPortraitConfig = {
  [key: string]: string[];
};

export type EntityData = {
  [SubFolderName.CHIBI]?: SpineConfig;
  [SubFolderName.MINI]?: MiniOrPortraitConfig;
  [SubFolderName.PLAYROOM]?: SpineConfig;
  [SubFolderName.PORTRAIT]?: MiniOrPortraitConfig;
  [SubFolderName.SPINE]?: SpineConfig;
};

export type EntityMap = {
  [key: string]: {
    type: EntityType;
    data: EntityData;
  };
};

export enum SubFolderName {
  CHIBI = "Chibi",
  MINI = "Mini",
  PLAYROOM = "Playroom",
  PORTRAIT = "Portrait",
  SPINE = "Spine",
}
