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
        className="w-full px-4 py-2 font-light text-gray-800 bg-[#ffffff] border border-gray-300 focus:outline-none focus:border-gray-400 placeholder:text-gray-600"
      />
    </div>
  );
};

export default MessageInput
