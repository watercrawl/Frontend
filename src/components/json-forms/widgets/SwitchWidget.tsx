import React from 'react';
import { FieldProps } from '../types/schema';

export const SwitchWidget: React.FC<FieldProps> = ({
  schema,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={schema.disabled || disabled}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:peer-focus:ring-primary-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
      </div>
      {schema.title && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {schema.title}
        </span>
      )}
    </label>
  );
};
