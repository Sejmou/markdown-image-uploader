import React from 'react';

type Props = {
  id: string;
  type: string;
  // description: string;
  label: string;
  placeholder: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({ id, label, type, placeholder, onChange }: Props) => {
  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* {error && <p className="text-red-500 text-xs italic">{errordescription}</p>} */}
    </div>
  );
};

export default Input;
