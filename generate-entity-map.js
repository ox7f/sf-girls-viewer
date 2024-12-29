import fs from "fs";
import path from "path";

const ASSETS_PATH = path.join(process.cwd(), "public/assets");

// Checks if a path exists and is a directory
const isDirectory = (filePath) => {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
};

// Returns the relative file path if it exists
const getRelativePathIfExists = (filePath) => {
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
const getFoldersContents = (path) => {
  try {
    return fs.readdirSync(path);
  } catch (err) {
    console.error(`Error reading directory ${path}:`, err);
    return [];
  }
};

const processSpineFiles = (subEntityPath, files) => {
  const spines = {};

  for (const spine of files) {
    if (spine.endsWith(".json")) {
      const spineName = path.basename(spine, ".json");
      const keyName = spineName.replace(".model3", "");
      const paths = [
        ".json",
        "_Background.png",
        "_Foreground.png",
        "_Addition.json",
      ].map((ext) => path.join(subEntityPath, `${spineName}${ext}`));

      spines[keyName] = {
        name: keyName,
        fileName: getRelativePathIfExists(paths[0]),
        background: getRelativePathIfExists(paths[1]),
        foreground: getRelativePathIfExists(paths[2]),
        addition: getRelativePathIfExists(paths[3]),
      };
    }
  }

  return spines;
};

const processImages = (subEntityPath, files, folderName) => {
  const groupedFiles = {};

  files.forEach((file) => {
    const match = file.match(
      /(.*?_(Mini|Portrait)_\d+)(?:_(Skin\d+))?(?:_Censored)?\.png/i,
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

        const fileName = getRelativePathIfExists(
          path.join(subEntityPath, file),
        );

        if (fileName) {
          groupedFiles[skinName].push(fileName);
        }
      } else {
        const fileName = getRelativePathIfExists(
          path.join(subEntityPath, file),
        );

        if (fileName && !groupedFiles[baseKey].includes(fileName)) {
          groupedFiles[baseKey].push(fileName);
        }
      }
    }
  });

  return groupedFiles;
};

const loadDataForEntity = (entityPath) => {
  const data = {
    Chibi: {},
    Mini: {},
    Playroom: {},
    Portrait: {},
    Spine: {},
  };
  const type = entityPath.includes("Agents") ? "Agents" : "Seekers";
  const subFolders = getFoldersContents(entityPath);

  subFolders.forEach((folder) => {
    const folderPath = path.join(entityPath, folder);
    if (isDirectory(folderPath)) {
      const files = getFoldersContents(folderPath);

      switch (folder) {
        case "Playroom":
        case "Spine":
        case "Chibi":
          data[folder] = processSpineFiles(folderPath, files);
          break;
        case "Mini":
        case "Portrait":
          data[folder] = processImages(folderPath, files, folder);
          break;
      }
    }
  });

  return { data, type };
};

const loadAllEntities = () => {
  const entityMap = {};
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

const generateEntityMap = async () => {
  const entityMap = loadAllEntities();
  const outputPath = path.join(ASSETS_PATH, "entityMap.json");
  fs.writeFile(outputPath, JSON.stringify(entityMap, null, 2), () => {});
  console.log("Config file generated at:", outputPath);
};

(async () => {
  await generateEntityMap();
})();
