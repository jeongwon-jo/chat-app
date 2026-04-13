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
      <label htmlFor={id} className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{label}</label>
      <div className="mt-2">
        <input
          type={type}
          id={id}
          disabled={disabled}
          placeholder=""
          {...register(id, { required })}
          className={
            (clsx(
              `form-input block w-full py-3 text-gray-900 dark:text-gray-100 dark:bg-gray-800 border border-inset border-gray-300 dark:border-gray-600 placeholder:text-gray-400 focus:border-2 focus:border-inset focus:border-primary sm:text-sm sm:leading-6 px-2`,
              errors[id] && "focus:border-rose-500",
              disabled && "opacity-50 cursor-default"
            ))
          }
        />
      </div>
    </div>
  );
};

export default Input;
