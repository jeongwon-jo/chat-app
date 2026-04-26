import clsx from "clsx";
import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  className
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        `flex justify-center px-3 py-3 text-md font-semibold focus-visible:outline focus-visible:outline-offset-2 transition ${className}`,
        disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        secondary && "bg-secondary text-secondary-text hover:bg-secondary-hover",
        danger && "bg-rose-600 hover:bg-rose-700 focus-visible:outline-rose-700 text-white",
        !secondary && !danger && "bg-primary hover:bg-primary-hover text-primary-text focus-visible:outline-primary"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
