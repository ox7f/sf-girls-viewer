"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { entityMapAtom } from "@/atoms/atoms";

export const DataInitializer = () => {
  const setEntityMap = useSetAtom(entityMapAtom);

  useEffect(() => {
    const fetchSceneData = async () => {
      try {
        const response = await fetch("/api/entity-map");
        const data = await response.json();
        setEntityMap(data.data);
      } catch (error) {
        console.error("Error fetching scene data:", error);
      }
    };

    fetchSceneData();
  }, [setEntityMap]);

  return null;
};
