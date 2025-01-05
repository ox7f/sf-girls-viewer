/* eslint-disable react-hooks/exhaustive-deps */
import { narration } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, type FC } from "react";
import NarrationScreen from "./narration/NarrationScreen";
import NextButton from "./narration/NextButton";
import BackButton from "./narration/BackButton";
import { pixiAnimationListAtom } from "../atoms";
import type { ModifiedSpine } from "../types";
import { loadNarration } from "../utils";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";

const PixiVN: FC = () => {
  const queryClient = useQueryClient();
  const animationList = useAtomValue(pixiAnimationListAtom);

  useEffect(() => {
    const initNarration = async () => {
      const startLabel = await loadNarration(scene as ModifiedSpine);
      narration.callLabel(startLabel, {}).then(() => {
        queryClient.invalidateQueries({
          queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
        });
      });
    };

    const scene = animationList.find((animation) =>
      animation.meta.config.fileName?.toLowerCase().includes("scene"),
    );

    if (scene) {
      initNarration();
    }
  }, [animationList]);

  return (
    <>
      <NarrationScreen />
      <NextButton />
      <BackButton />
    </>
  );
};

export default PixiVN;
