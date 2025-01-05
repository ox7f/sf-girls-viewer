export type Dialogue = {
  animation?: string;
  character?: string;
  text: string;
  sound?: string;
};

export type DialogueData = {
  text: Dialogue[];
};
