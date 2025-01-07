/* eslint-disable react-hooks/exhaustive-deps */
import { narration } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState, type FC } from "react";
import NarrationScreen from "./narration/NarrationScreen";
import NextButton from "./narration/NextButton";
// import BackButton from "./narration/BackButton";
import { pixiAnimationListAtom } from "../atoms";
import type { ModifiedSpine } from "../types";
import { loadNarration } from "../utils";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";

const PixiVN: FC = () => {
  const queryClient = useQueryClient();
  const animationList = useAtomValue(pixiAnimationListAtom);
  const [hideNarration, setHideNarration] = useState(true);

  useEffect(() => {
    const initNarration = async () => {
      const startLabel = await loadNarration(scene as ModifiedSpine);
      narration.callLabel(startLabel, {}).then(() => {
        queryClient.invalidateQueries({
          queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
        });
        setHideNarration(false);
      });
    };

    const scene = animationList.find((animation) =>
      animation.meta.config.fileName?.toLowerCase().includes("scene"),
    );

    if (scene) {
      initNarration();
    }
  }, [animationList]);

  if (hideNarration) {
    return;
  }

  return (
    <div
      className="tile u-absolute u-bottom-4 mx-10 p-1 bg-gray-200 u-round-md u-shadow-md"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="u-flex u-flex-column tile__container">
        <div>
          <NarrationScreen />
        </div>
        <div className="u-absolute u-right-0 u-bottom-0">
          <NextButton />
        </div>
        <div>
          TODO
          {/* NarrationSettings (<BackButton />) */}
        </div>
      </div>
    </div>
  );
};

export default PixiVN;
