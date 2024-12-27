"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import Select from "react-select";
import {
  entityMapAtom,
  fileAtom,
  pixiAnimationListAtom,
  selectedMenuTabAtom,
} from "@/atoms";

import type { ModifiedSpine, DropdownState } from "@/types";

import {
  getEntityOptions,
  getEntitySceneOptions,
  getSceneData,
  formatGroupLabel,
} from "@/utils";

export const PixiViewerSettingsScene = () => {
  const entityMap = useAtomValue(entityMapAtom);
  const animationList = useAtomValue(pixiAnimationListAtom);
  const setNewFile = useSetAtom(fileAtom);
  const setSelectedTab = useSetAtom(selectedMenuTabAtom);

  const [selectedEntity, setSelectedEntity] = useState<DropdownState>(null);
  const [selectedScene, setSelectedScene] = useState<DropdownState>(null);

  if (!entityMap) {
    return;
  }

  const entityOptions = getEntityOptions(entityMap);
  const sceneOptions = getEntitySceneOptions(entityMap, selectedEntity?.value);

  const handleEntityChange = (option: DropdownState) => {
    setSelectedEntity(option);
    setSelectedScene(null);
  };

  const handleSceneChange = (option: DropdownState) => setSelectedScene(option);

  const viewScene = (index: number) => {
    if (!selectedEntity || !selectedScene) {
      return;
    }

    setNewFile({
      config: getSceneData(
        entityMap,
        selectedEntity.value,
        selectedScene.value,
      ),
      index,
      method: "add",
      name: selectedEntity.value,
      type: "spine",
    });
  };

  const renderAnimationTile = (animation: ModifiedSpine, index: number) => (
    <div
      key={index}
      className="tile mt-1 u-border-1 u-round-xs border-gray-400 animated fadeIn"
    >
      <div className="tile__container p-1">
        <p className="tile__title m-0">{animation.meta.name}</p>
        <p className="tile__subtitle m-0">{animation.meta.config.name}</p>
      </div>
      <div className="tile__buttons m-0 u-text-right">
        <div className="u-flex u-flex-column">
          <button
            className="outline btn-dark border-white"
            onClick={() => setSelectedTab(animation.meta.index)}
          >
            <FaEllipsisH />
          </button>
          <button
            className="outline btn-danger border-white"
            onClick={() => setNewFile({ ...animation.meta, method: "remove" })}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <fieldset
      className="u-flex u-flex-column animated fadeIn"
      style={{ padding: "0.5rem" }}
    >
      <div className="u-flex u-justify-space-between u-items-center">
        <div style={{ width: "14.25rem" }}>
          <Select
            placeholder="Select Character"
            value={selectedEntity}
            onChange={handleEntityChange}
            options={entityOptions}
            isSearchable={true}
            isClearable={true}
            formatGroupLabel={formatGroupLabel}
          />

          <div className="space" style={{ height: "0.5rem" }} />

          <Select
            placeholder="Select Scene"
            value={selectedScene}
            onChange={handleSceneChange}
            options={sceneOptions}
            isSearchable={true}
            isClearable={true}
            formatGroupLabel={formatGroupLabel}
          />
        </div>
        <button
          disabled={!selectedScene}
          className="btn btn-info mb-0"
          onClick={() => viewScene(animationList.length)}
        >
          View
        </button>
      </div>
      {animationList.length > 0 && animationList.map(renderAnimationTile)}
    </fieldset>
  );
};
