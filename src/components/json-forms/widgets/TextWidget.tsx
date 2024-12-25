import React from 'react';
import { FieldProps } from '../types/schema';

interface TextWidgetProps extends FieldProps {
  type?: string;
}

export const TextWidget: React.FC<TextWidgetProps> = ({
  schema,
  value,
  onChange,
  onBlur,
  errors,
  required,
  type = 'text',
}) => {
  const hasError = errors && errors.length > 0;
  const ui = schema.ui || {};

  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={ui.placeholder}
      required={required}
      disabled={schema.disabled}
      readOnly={schema.readOnly}
      autoFocus={ui.autoFocus}
      className={`w-full h-10 px-3 bg-transparent border ${
        hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
      } rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
        hasError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'
      } dark:focus:border-primary-500 transition-colors ${ui.inputClassName || ''}`}
    />
  );
};
