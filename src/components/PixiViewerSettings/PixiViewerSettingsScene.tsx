import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import Select from "react-select";
import {
  dropdownSelectionAtom,
  entityMapAtom,
  fileAtom,
  pixiAnimationListAtom,
  selectedMenuTabAtom,
} from "../../atoms";
import type { DropdownState, FileMeta } from "../../types";
import {
  getEntityOptions,
  getEntitySceneOptions,
  getSceneData,
  formatGroupLabel,
} from "../../utils";

export const PixiViewerSettingsScene = () => {
  const entityMap = useAtomValue(entityMapAtom);
  const animationList = useAtomValue(pixiAnimationListAtom);
  const setNewFile = useSetAtom(fileAtom);
  const setSelectedTab = useSetAtom(selectedMenuTabAtom);

  const [dropdownSelection, setDropdownSelection] = useAtom(
    dropdownSelectionAtom,
  );

  if (!entityMap) {
    return;
  }

  const entityOptions = getEntityOptions(entityMap);
  const sceneOptions = getEntitySceneOptions(
    entityMap,
    dropdownSelection.entity?.value,
  );

  const handleEntityChange = (option: DropdownState) =>
    setDropdownSelection({
      entity: option,
      scene: null,
    });

  const handleSceneChange = (option: DropdownState) =>
    setDropdownSelection((prev) => ({
      ...prev,
      scene: option,
    }));

  const viewScene = (index: number) => {
    const entity = dropdownSelection.entity?.value;
    const scene = dropdownSelection.scene?.value;

    if (!entity || !scene) {
      return;
    }

    const config = getSceneData(entityMap, entity, scene);
    const isLive2D = config.fileName?.includes(".model3.json");

    setNewFile({
      config: config,
      index,
      method: "add",
      name: entity,
      type: isLive2D ? "live2d" : "spine",
    });
  };

  const renderAnimationTile = (file: FileMeta, index: number) => (
    <div
      key={index}
      className="tile mt-1 u-border-1 u-round-xs border-gray-400 animated fadeIn"
    >
      <div className="tile__container p-1">
        <p className="tile__title m-0">{file.name}</p>
        <p className="tile__subtitle m-0">{file.config.name}</p>
      </div>
      <div className="tile__buttons m-0 u-text-right">
        <div className="u-flex u-flex-column">
          <button
            className="outline btn-dark border-white"
            onClick={() => setSelectedTab(file.index)}
          >
            <FaEllipsisH />
          </button>
          <button
            className="outline btn-danger border-white"
            onClick={() => setNewFile({ ...file, method: "remove" })}
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
            value={dropdownSelection.entity}
            onChange={handleEntityChange}
            options={entityOptions}
            isSearchable={true}
            isClearable={true}
            formatGroupLabel={formatGroupLabel}
          />

          <div className="space" style={{ height: "0.5rem" }} />

          <Select
            placeholder="Select Scene"
            value={dropdownSelection.scene}
            onChange={handleSceneChange}
            options={sceneOptions}
            isSearchable={true}
            isClearable={true}
            formatGroupLabel={formatGroupLabel}
          />
        </div>
        <button
          disabled={!dropdownSelection.scene}
          className="btn btn-info mb-0"
          onClick={() => viewScene(animationList.length)}
        >
          View
        </button>
      </div>
      {animationList.length > 0 &&
        animationList.map((animation, index) =>
          renderAnimationTile(animation.meta, index),
        )}
    </fieldset>
  );
};
