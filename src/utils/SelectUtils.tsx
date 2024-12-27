import { DropdownOption } from "@/types/DropdownTypes";

type Group = {
  label: string;
  options: DropdownOption[];
};

export const formatGroupLabel = (group: Group) => (
  <div className="u-flex u-justify-space-between">
    <span>{group.label}</span>
    <span
      className="bg-gray-100 u-round-full text-gray-700"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        textAlign: "center",
        lineHeight: "2",
      }}
    >
      {group.options.length}
    </span>
  </div>
);
