import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { entityMapAtom } from "../atoms";

export const DataInitializer = () => {
  const setEntityMap = useSetAtom(entityMapAtom);

  useEffect(() => {
    const fetchSceneData = async () => {
      try {
        const response = await fetch("/entityMap.json");
        const data = await response.json();
        setEntityMap(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        throw new Error("Failed to load initial data.");
      }
    };

    fetchSceneData();
  }, [setEntityMap]);

  return null;
};
