import { DropdownOption } from "@/types/DropdownTypes";
import {
  type EntityData,
  type EntityMap,
  type SpineData,
  SubFolderName,
} from "@/types/FileTypes";

export const menuItems = ["Scene", "Global"];

export const mapToDropdownOption = (
  value: string,
  group?: string,
): DropdownOption => ({ value, label: value.replace(/_/g, " "), group });

const createEntityOptions = (entityMap: EntityMap, type: string) =>
  Object.entries(entityMap)
    .filter(([, value]) => value.type === type)
    .map(([key]) => mapToDropdownOption(key, type));

const createSceneOptions = (data: EntityData, type: SubFolderName) =>
  Object.keys(data[type] ?? {}).map((key) => mapToDropdownOption(key, type));

export const getEntityOptions = (entityMap: EntityMap) => [
  {
    label: "Agents",
    options: createEntityOptions(entityMap, "Agents"),
  },
  {
    label: "Seekers",
    options: createEntityOptions(entityMap, "Seekers"),
  },
];

export const getEntitySceneOptions = (
  entityMap: EntityMap,
  entityName?: string,
) => {
  if (!entityName || !entityMap[entityName]) return [];
  const data = entityMap[entityName].data;

  return [
    {
      label: "Spine",
      options: createSceneOptions(data, SubFolderName.SPINE),
    },
    {
      label: "Playroom",
      options: createSceneOptions(data, SubFolderName.PLAYROOM),
    },
  ];
};

export const getSceneData = (
  entityData: EntityMap,
  entityName: string,
  sceneName: string,
): SpineData => {
  const isPlayroom = sceneName.includes(SubFolderName.PLAYROOM);

  const sceneData =
    entityData[entityName]?.data[
      isPlayroom ? SubFolderName.PLAYROOM : SubFolderName.SPINE
    ]?.[sceneName];

  if (!sceneData) {
    throw new Error(`Scene "${sceneName}" not found in data.`);
  }

  return sceneData;
};
