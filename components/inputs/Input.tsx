"use client"

import clsx from "clsx";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
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
      <label htmlFor={id} className="block text-sm font-semibold leading-6 text-gray-300">{label}</label>
      <div className="mt-2">
        <input
          type={type}
          id={id}
          disabled={disabled}
          placeholder=""
          {...register(id, { required })}
          className={
            (clsx(
              `form-input block w-full py-2.5 text-gray-100 bg-gary-900 border border-[#2e2e2e] placeholder:text-gray-600 focus:border-2 focus:border-primary sm:text-sm sm:leading-6 px-2 outline-none`,
              errors[id] && "focus:border-rose-500 border-rose-800",
              disabled && "opacity-50 cursor-default"
            ))
          }
        />
      </div>
    </div>
  );
};

export default Input;
