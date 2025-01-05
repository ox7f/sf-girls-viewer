import { FaPlus, FaMinus } from "react-icons/fa";
import Button from "./Button";

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

const SidebarToggleButton = ({ isOpen, onClick }: Props) => {
  const buttonClass = isOpen ? "btn-transparent" : "btn-light";
  const Icon = isOpen ? FaMinus : FaPlus;

  return (
    <div
      className="u-absolute u-z-1 u-top-0 u-right-0 mr-4"
      style={{ marginTop: "4.33rem" }}
    >
      <Button onClick={onClick} className={`${buttonClass} u-round-full`}>
        <Icon size={16} className="u-center" />
      </Button>
    </div>
  );
};

export default SidebarToggleButton;
