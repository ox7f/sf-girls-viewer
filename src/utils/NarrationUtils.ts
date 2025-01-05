import {
  CharacterBaseModel,
  getCharacterById,
  Label,
  narration,
  newLabel,
  saveCharacter,
  sound,
} from "@drincs/pixi-vn";
import type { Dialogue, DialogueData, ModifiedSpine } from "../types";

const fetchTextData = async (path: string): Promise<DialogueData> => {
  try {
    const response = await fetch(path);
    return await response.json();
  } catch (error) {
    console.error("Error fetching text data:", error);
    throw new Error("Failed to load text data.");
  }
};

const getSoundFolderPath = (name: string) => `/assets/Agents/${name}/Sounds`;

const loadSound = (dialogues: Dialogue[], folderPath: string) => {
  dialogues
    .filter(({ sound: soundName }) => soundName)
    .forEach(({ sound: soundName }) => {
      sound.add(soundName!, `${folderPath}/${soundName}`);
    });
};

const createLabel = (spine: ModifiedSpine, dialogues: Dialogue[]): Label => {
  const { name: sceneName } = spine.meta;
  let previousSoundName: string | undefined;

  return newLabel(
    sceneName,
    dialogues.map(({ animation, character, text, sound: soundName }) => () => {
      let newCharacter: CharacterBaseModel | undefined = undefined;

      newCharacter = narration.dialogue?.character
        ? getCharacterById(narration.dialogue.character)
        : undefined;

      if (!newCharacter && character) {
        newCharacter = new CharacterBaseModel(character, { name: character });
        saveCharacter(newCharacter);
      }

      narration.dialogue = newCharacter
        ? { character: newCharacter, text }
        : text;

      if (animation) {
        spine.state.setAnimation(0, animation, true);
      }

      if (soundName) {
        if (previousSoundName) {
          sound.stop(previousSoundName);
        }

        sound.play(soundName, { volume: 0.5 });
        previousSoundName = soundName;
      }
    }),
  );
};

export const loadNarration = async (
  animation: ModifiedSpine,
): Promise<Label> => {
  const {
    meta: {
      name: animationName = "",
      config: { fileName = "" },
    },
  } = animation;
  const soundFolderPath = getSoundFolderPath(animationName);
  const textData = await fetchTextData(fileName.replace(".json", "_Text.json"));

  loadSound(textData.text, soundFolderPath);
  const startLabel = createLabel(animation, textData.text);

  return startLabel;
};
