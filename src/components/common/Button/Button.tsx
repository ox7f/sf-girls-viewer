import { PropsWithChildren } from "react";

type Props = {
  onClick: () => void;
  className?: string;
};

const Button = ({ children, className, onClick }: PropsWithChildren<Props>) => (
  <button onClick={onClick} className={`mb-0 p-0 h-6 w-6 ${className}`}>
    {children}
  </button>
);

export default Button;
