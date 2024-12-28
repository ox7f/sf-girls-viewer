export type DropdownOption = {
  value: string;
  label: string;
  group?: string;
};

export type DropdownState = DropdownOption | null;

export type DropdownSelection = {
  entity: DropdownState;
  scene: DropdownState;
};
