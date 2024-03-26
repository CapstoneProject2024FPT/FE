import { useEffect, useState } from "react";
import "./Button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  value,
  variant = "primary",
  ...rest
}) => {
  const [classes, setClasses] = useState<string>(variant);

  return (
    <button
      className={`btn ${classes}`}
      disabled={disabled}
      onClick={onClick}
      value={value}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
