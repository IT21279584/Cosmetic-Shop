import React from "react";

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <label className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
