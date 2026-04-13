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
}
const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        `flex justify-center px-3 py-4 text-md font-semibold focus-visible:outline focus-visible:outline-offset-2`,
        disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        secondary ? "text-gray-900 dark:text-gray-100" : "text-gray-800",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600 text-white",
        !secondary && !danger && "bg-primary hover:bg-primary-hover focus-visible:outline-primary"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
