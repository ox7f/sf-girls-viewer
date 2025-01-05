import type { FC } from "react";
import {
  useQueryCanGoBack,
  useQueryCanGoNext,
  useQueryDialogue,
} from "../../use_query/useQueryInterface";

const NarrationScreen: FC = () => {
  const { data: { text, character } = {} } = useQueryDialogue();
  const { data: canGoNext = false } = useQueryCanGoNext();
  const { data: canGoBack = false } = useQueryCanGoBack();

  if (!text) {
    return null;
  }

  return (
    <div>
      {character && character.name && (
        <div>
          {character.name + (character.surname ? " " + character.surname : "")}
        </div>
      )}
      <div
        style={{
          overflow: "auto",
          marginRight: canGoNext || canGoBack ? "40px" : undefined,
          height: "100%",
        }}
      >
        {character?.icon && (
          <div>
            <img src={character?.icon} loading="lazy" alt="" />
          </div>
        )}
        <div>
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
};

export default NarrationScreen;
