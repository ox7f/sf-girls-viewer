import type { FC } from "react";
import { useQueryDialogue } from "../../use_query/useQueryInterface";

const NarrationScreen: FC = () => {
  const { data: { text, character } = {} } = useQueryDialogue();

  if (!text) {
    return null;
  }

  return (
    <div className="u-flex u-items-center">
      {character?.icon && (
        <div className="tile__icon">
          <figure>
            <img
              style={{ maxWidth: "100px" }}
              src={character?.icon}
              loading="lazy"
              alt=""
            />
          </figure>
        </div>
      )}

      <div className="tile__container">
        {character && character.name && (
          <p className="tile__title m-0 u-text-bold u-text-primary">
            {character.name}
          </p>
        )}
        <p className="tile__subtitle m-0 u-text-wrap">{text}</p>
      </div>
    </div>
  );
};

export default NarrationScreen;
