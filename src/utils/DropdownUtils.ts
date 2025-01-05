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
): DropdownOption => ({
  value,
  label: value.replace(/_/g, " "),
  group,
});

const createEntityOptions = (
  entityMap: EntityMap,
  type: string,
): DropdownOption[] =>
  Object.entries(entityMap)
    .filter(([, value]) => value.type === type)
    .map(([key]) => mapToDropdownOption(key, type));

const createSceneOptions = (
  data: EntityData,
  type: SubFolderName,
): DropdownOption[] =>
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
  {
    label: "Partyrooms",
    options: [
      { value: "Partyrooms", label: "Partyrooms", group: "Partyrooms" },
    ],
  },
];

export const getEntitySceneOptions = (
  entityMap: EntityMap,
  entityName?: string,
) => {
  if (entityName === "Partyrooms") {
    return Object.keys(entityMap)
      .filter((key) => key.toLowerCase().includes("partyroom"))
      .map((key) => mapToDropdownOption(key, "Partyrooms"));
  }

  if (!entityName || !entityMap[entityName]) {
    return [];
  }

  const data = entityMap[entityName].data;

  return [
    {
      label: "Chibi",
      options: createSceneOptions(data, SubFolderName.CHIBI),
    },
    {
      label: "Playroom",
      options: createSceneOptions(data, SubFolderName.PLAYROOM),
    },
    {
      label: "Scene",
      options: createSceneOptions(data, SubFolderName.SCENE),
    },
    {
      label: "Spine",
      options: createSceneOptions(data, SubFolderName.SPINE),
    },
  ];
};

const getPartyroomData = (
  entityData: EntityMap,
  sceneName: string,
): SpineData => {
  const sceneData = entityData[sceneName]?.data;

  if (!sceneData) {
    throw new Error(`Scene "${sceneName}" not found in data.`);
  }

  return sceneData as SpineData;
};

export const getSceneData = (
  entityData: EntityMap,
  entityName: string,
  sceneName: string,
): SpineData => {
  if (sceneName.toLowerCase().includes("partyroom")) {
    return getPartyroomData(entityData, sceneName);
  }

  const folderKey =
    [SubFolderName.CHIBI, SubFolderName.PLAYROOM, SubFolderName.SCENE].find(
      (key) => sceneName.includes(key),
    ) || SubFolderName.SPINE;

  const sceneData = entityData[entityName]?.data[folderKey]?.[sceneName];

  if (!sceneData) {
    throw new Error(`Scene "${sceneName}" not found in data.`);
  }

  return sceneData as SpineData;
};
