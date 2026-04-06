import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}
const MessageInput = ({
	placeholder,
	id,
	type,
	required,
	register,
}: MessageInputProps) => {
  return <div className='relative w-full'>
    <input type={type} id={id} placeholder={placeholder} {...register(id, {required})} className='w-full px-4 py-2 font-light text-black rounded-full bg-neutral-100 focus:outline-none' />
  </div>;
};

export default MessageInput