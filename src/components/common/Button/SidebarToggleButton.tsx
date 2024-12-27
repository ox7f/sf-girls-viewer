"use client";

import type { FC } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Button from "@/components/common/Button/Button";

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

const SidebarToggleButton: FC<Props> = ({ isOpen, onClick }) => {
  const buttonClass = isOpen ? "btn-transparent" : "btn-light";
  const Icon = isOpen ? FaMinus : FaPlus;

  return (
    <div className="u-absolute u-z-1 u-top-0 u-right-0 mr-4 mt-8">
      <Button onClick={onClick} className={`${buttonClass} u-round-full`}>
        <Icon size={16} className="u-center" />
      </Button>
    </div>
  );
};

export default SidebarToggleButton;
