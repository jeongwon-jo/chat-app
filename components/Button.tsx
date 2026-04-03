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
        `flex justify-center rounded-md px-3 py-3 text-md font-semibold focus-visible:outline focus-visible:outline-offset-2`,
        disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
        !secondary && !danger && "bg-orange-500 hover:bg-orange-600 focus-visible:outline-orange-500"
			)}
		>
			{children}
		</button>
	);
};

export default Button;
