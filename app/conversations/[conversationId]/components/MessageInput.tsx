import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onTyping?: () => void;
}
const MessageInput = ({
  placeholder,
  id,
  type,
  required,
  register,
  onTyping,
}: MessageInputProps) => {
  const { onChange: registerOnChange, ...rest } = register(id, { required })

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={(e) => {
          registerOnChange(e)
          onTyping?.()
        }}
        {...rest}
        className="w-full px-4 py-2 font-light text-black dark:text-gray-100 rounded-full bg-neutral-100 dark:bg-gray-800 focus:outline-none"
      />
    </div>
  );
};

export default MessageInput
