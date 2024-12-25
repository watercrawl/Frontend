import React from 'react';
import { FieldProps } from '../types/schema';

export const NumberWidget: React.FC<FieldProps> = ({
  schema,
  value,
  onChange,
  onBlur,
  errors,
  required,
}) => {
  const hasError = errors && errors.length > 0;

  return (
    <input
      type={schema.type === 'integer' ? 'number' : 'text'}
      value={value || ''}
      onChange={(e) => {
        const val = e.target.value;
        if (val === '') {
          onChange(undefined);
        } else if (schema.type === 'integer') {
          onChange(parseInt(val, 10));
        } else {
          onChange(parseFloat(val));
        }
      }}
      onBlur={onBlur}
      placeholder={schema.placeholder}
      required={required}
      disabled={schema.disabled}
      readOnly={schema.readOnly}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.type === 'integer' ? 1 : 'any'}
      className={`w-full h-10 px-3 bg-transparent border ${
        hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
      } rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
        hasError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'
      } dark:focus:border-primary-500 transition-colors`}
    />
  );
};
