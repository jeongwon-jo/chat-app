import React from 'react'
import ReactSelect from "react-select"

interface SelectProps {
  disabled?: boolean;
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
}
const Select = ({ disabled, label, onChange, value, options }: SelectProps) => {
  return <div>
    <label htmlFor="" className='block text-sm font-medium leading-6 text-gray-300'>{label}</label>
    <div className='mt-2'>
      <ReactSelect
        isDisabled={disabled}
        value={value}
        onChange={onChange}
        isMulti={true}
        options={options}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({ ...base, backgroundColor: '#1a1a1a', borderColor: '#2e2e2e', borderRadius: 0, color: '#f0f0f0' }),
          menu: (base) => ({ ...base, backgroundColor: '#1a1a1a', borderRadius: 0, border: '1px solid #2e2e2e' }),
          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#252525' : '#1a1a1a', color: '#f0f0f0' }),
          multiValue: (base) => ({ ...base, backgroundColor: '#252525', borderRadius: 0 }),
          multiValueLabel: (base) => ({ ...base, color: '#c0c0c0' }),
          multiValueRemove: (base) => ({ ...base, color: '#808080', ':hover': { backgroundColor: '#333', color: '#fff' } }),
          input: (base) => ({ ...base, color: '#f0f0f0' }),
          placeholder: (base) => ({ ...base, color: '#606060' }),
          singleValue: (base) => ({ ...base, color: '#f0f0f0' }),
        }}
        classNames={{ control: () => "text-sm" }}
      />
    </div>
  </div>;
};

export default Select