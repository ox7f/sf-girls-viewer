import type { FC } from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

const Button: FC<Props> = ({ children, className, onClick }) => (
  <button onClick={onClick} className={`mb-0 p-0 h-6 w-6 ${className}`}>
    {children}
  </button>
);

export default Button;
