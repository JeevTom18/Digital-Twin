import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ label, name, value, description, unit, ...props }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
            {label}
        </label>
         <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">{value}{unit}</span>
      </div>
       {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      <input
        id={name}
        name={name}
        type="range"
        value={value}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        {...props}
      />
    </div>
  );
};

export default Slider;
