"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { entityMapAtom } from "@/atoms/atoms";

export const DataInitializer = () => {
  const setEntityMap = useSetAtom(entityMapAtom);

  useEffect(() => {
    const fetchSceneData = async () => {
      try {
        const response = await fetch("/assets/entityMap.json");
        const data = await response.json();
        setEntityMap(data);
      } catch (error) {
        console.error("Error fetching scene data:", error);
      }
    };

    fetchSceneData();
  }, [setEntityMap]);

  return null;
};
