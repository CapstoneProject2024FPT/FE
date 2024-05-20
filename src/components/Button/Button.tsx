import "./Button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  value,
  ...rest
}) => {
  return (
    <button disabled={disabled} onClick={onClick} value={value} {...rest}>
      {children}
    </button>
  );
};

export default Button;
