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

const getIconPath = (name: string, index: number) =>
  `/assets/Agents/${name}/Mini/${name}_Mini_${index}.png`;

const getSoundFolderPath = (name: string) => `/assets/Agents/${name}/Sounds`;

const loadSound = (dialogues: Dialogue[], folderPath: string) => {
  dialogues
    .filter(({ sound: soundName }) => soundName)
    .forEach(({ sound: soundName }) => {
      sound.add(soundName!, `${folderPath}/${soundName}`);
    });
};

const createLabel = (spine: ModifiedSpine, dialogues: Dialogue[]): Label => {
  const { name } = spine.meta;
  let previousSoundName: string | undefined;
  let lewdness = 1;

  const getOrCreateCharacter = (character: string): CharacterBaseModel[] => {
    const existingCharacter = narration.dialogue?.character
      ? getCharacterById(narration.dialogue.character)
      : undefined;

    if (existingCharacter) {
      return [existingCharacter] as CharacterBaseModel[];
    }

    const characters = [1, 2, 3].map(
      (emotion) =>
        new CharacterBaseModel(
          { id: character, emotion: emotion.toString() },
          {
            name: emotion === 1 ? character : undefined,
            icon: getIconPath(name, emotion),
          },
        ),
    );

    saveCharacter(characters);
    return characters;
  };

  return newLabel(
    name,
    dialogues.map(
      ({ animation, character, text, sound: soundName }) =>
        async () => {
          if (animation) {
            const animationLewdness = Number(animation.match(/\d+/)?.[0]);

            if (animationLewdness > lewdness) {
              lewdness = animationLewdness;
            }

            spine.state.setAnimation(0, animation, true);
          }

          if (soundName) {
            if (previousSoundName) {
              sound.stop(previousSoundName);
            }

            await sound.play(soundName, { volume: 0.5 });
            previousSoundName = soundName;
          }

          let activeCharacter: CharacterBaseModel | undefined;
          if (character) {
            const [char1, char2, char3] = getOrCreateCharacter(character);
            activeCharacter = [char1, char2, char3][lewdness - 1] ?? char1;
          }

          narration.dialogue = activeCharacter
            ? { character: activeCharacter, text }
            : text;
        },
    ),
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
