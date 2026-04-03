"use client"

import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import clsx from "clsx"
interface InputProps {
	id: string;
	label: string;
	type?: string;
	disabled?: boolean;
	required?: boolean;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors;
}
const Input: React.FC<InputProps> = ({
	id,
	label,
	type = "text",
	disabled,
	register,
	required,
	errors,
}) => {
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
			<div className="mt-2">
				<input
					type={type}
					id={id}
					disabled={disabled}
					placeholder=""
					{...register(id, { required })}
					className={
						(clsx(
              `form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6`,
              errors[id] && "focus:ring-rose-500",
						  disabled && "opacity-50 cursor-default"
						))
					}
				/>
			</div>
		</div>
	);
};

export default Input;
