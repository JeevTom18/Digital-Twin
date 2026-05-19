import React from 'react';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, name, checked, description, onChange, ...props }) => {
  return (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
            {label}
        </label>
        {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
        <div className="flex items-center">
            <input
                id={name}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden"
                {...props}
            />
            <label
                htmlFor={name}
                className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </label>
            <span className="ml-3 text-sm text-slate-600">{checked ? 'Enabled' : 'Disabled'}</span>
        </div>
    </div>
  );
};

export default Toggle;
