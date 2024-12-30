import {
  type EntityData,
  type EntityMap,
  type SpineData,
  SubFolderName,
  DropdownOption,
} from "../types";

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
  Object.keys(data[type] ?? {})
    .filter((key) => !key.includes("Addition"))
    .map((key) => mapToDropdownOption(key, type));

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
      label: "Chibi",
      options: createSceneOptions(data, SubFolderName.CHIBI),
    },
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
  const getFolderKey = (): keyof EntityData => {
    if (sceneName.includes(SubFolderName.CHIBI)) {
      return SubFolderName.CHIBI;
    }

    if (sceneName.includes(SubFolderName.PLAYROOM)) {
      return SubFolderName.PLAYROOM;
    }

    return SubFolderName.SPINE;
  };

  const folderKey = getFolderKey();
  const sceneData = entityData[entityName]?.data[folderKey]?.[sceneName];

  if (!sceneData) {
    throw new Error(`Scene "${sceneName}" not found in data.`);
  }

  return sceneData as SpineData;
};
