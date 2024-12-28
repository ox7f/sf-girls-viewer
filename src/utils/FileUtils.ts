"use server";

import fs from "fs";
import path from "path";
import {
  type EntityMap,
  type SpineConfig,
  SubFolderName,
} from "../types/FileTypes";

const ASSETS_PATH = path.join(process.cwd(), "public/assets");

// Checks if a path exists and is a directory
const isDirectory = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
};

// Returns the relative file path if it exists
const getRelativePathIfExists = (filePath: string): string | undefined => {
  try {
    return fs.existsSync(filePath)
      ? path
          .relative(process.cwd(), filePath)
          .replace(/\\/g, "/")
          .replace("public/", "")
      : undefined;
  } catch {
    return undefined;
  }
};

// Returns the content of a directory
const getFoldersContents = (path: string): string[] => {
  try {
    return fs.readdirSync(path);
  } catch (err) {
    console.error(`Error reading directory ${path}:`, err);
    return [];
  }
};

// Process spine files
const processSpineFiles = (
  subEntityPath: string,
  files: string[]
): SpineConfig => {
  const spines: SpineConfig = {};

  for (const spine of files) {
    if (spine.endsWith(".json")) {
      const spineName = path.basename(spine, ".json");
      const paths = [
        ".json",
        "_Background.png",
        "_Foreground.png",
        "_Addition.json",
      ].map((ext) => path.join(subEntityPath, `${spineName}${ext}`));

      spines[spineName] = {
        name: spineName,
        fileName: "/" + getRelativePathIfExists(paths[0]),
        background: "/" + getRelativePathIfExists(paths[1]),
        foreground: "/" + getRelativePathIfExists(paths[2]),
        addition: "/" + getRelativePathIfExists(paths[3]),
      };
    }
  }

  return spines;
};

// Process png files
const processImages = (
  subEntityPath: string,
  files: string[],
  folderName: string
): Record<string, string[]> => {
  const groupedFiles: Record<string, string[]> = {};

  files.forEach((file) => {
    const match = file.match(
      /(.*?_(Mini|Portrait)_\d+)(?:_(Skin\d+))?(?:_Censored)?\.png/i
    );

    if (match) {
      const skinSuffix = match[3];
      const baseKey = folderName === "Mini" ? "Mini" : "Portrait";

      if (!groupedFiles[baseKey]) {
        groupedFiles[baseKey] = [];
      }

      if (skinSuffix) {
        const skinName = `${baseKey}_${skinSuffix}`;

        if (!groupedFiles[skinName]) {
          groupedFiles[skinName] = [];
        }

        const fileName =
          "/" + getRelativePathIfExists(path.join(subEntityPath, file));

        if (fileName) {
          groupedFiles[skinName].push(fileName);
        }
      } else {
        const fileName =
          "/" + getRelativePathIfExists(path.join(subEntityPath, file));

        if (fileName && !groupedFiles[baseKey].includes(fileName)) {
          groupedFiles[baseKey].push(fileName);
        }
      }
    }
  });

  return groupedFiles;
};

// Load data for a specific entity
const loadDataForEntity = (entityPath: string): EntityMap[string] => {
  const data = {
    [SubFolderName.CHIBI]: {},
    [SubFolderName.MINI]: {},
    [SubFolderName.PLAYROOM]: {},
    [SubFolderName.PORTRAIT]: {},
    [SubFolderName.SPINE]: {},
  };
  const type = entityPath.includes("Agents") ? "Agents" : "Seekers";
  const subFolders = getFoldersContents(entityPath);

  subFolders.forEach((folder) => {
    const folderPath = path.join(entityPath, folder);
    if (isDirectory(folderPath)) {
      const files = getFoldersContents(folderPath);

      switch (folder) {
        case SubFolderName.PLAYROOM:
        case SubFolderName.SPINE:
        case SubFolderName.CHIBI:
          data[folder] = processSpineFiles(folderPath, files);
          break;
        case SubFolderName.MINI:
        case SubFolderName.PORTRAIT:
          data[folder] = processImages(folderPath, files, folder);
          break;
      }
    }
  });

  return { data, type };
};

// Main function to load all entities from the file system
const loadAllEntities = (): EntityMap => {
  const entityMap = {} as EntityMap;
  const entityTypes = ["Agents", "Seekers"];

  entityTypes.forEach((entityType) => {
    const entities = getFoldersContents(`${ASSETS_PATH}/${entityType}`);
    entities.forEach((entity) => {
      const entityPath = path.join(ASSETS_PATH, entityType, entity);
      if (isDirectory(entityPath)) {
        entityMap[entity] = loadDataForEntity(entityPath);
      }
    });
  });

  return entityMap;
};

export const generateEntityMap = () => {
  const entityMap = loadAllEntities();
  const outputPath = path.join(ASSETS_PATH, "entityMap.json");
  fs.writeFile(outputPath, JSON.stringify(entityMap, null, 2), () => {});
};
