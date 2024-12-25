import React, { useEffect } from 'react';
import { FieldProps } from '../types/schema';
import { SchemaField } from './SchemaField';

export const ObjectField: React.FC<FieldProps> = ({
  schema,
  path,
  value = {},
  onChange,
  errors = [],
}) => {
  // Initialize default values for properties
  useEffect(() => {
    if (schema.properties && Object.keys(value).length === 0) {
      const defaultValue: Record<string, any> = { ...value };
      let hasDefaults = false;

      Object.entries(schema.properties).forEach(([key, propSchema]) => {
        if (!(key in defaultValue) && propSchema.default !== undefined) {
          defaultValue[key] = propSchema.default;
          hasDefaults = true;
        }
      });

      if (hasDefaults) {
        onChange(defaultValue);
      }
    }
  }, [schema.properties, value, onChange]);

  const handlePropertyChange = (propertyName: string) => (propertyValue: any) => {
    onChange({
      ...value,
      [propertyName]: propertyValue,
    });
  };

  if (!schema.properties) {
    return null;
  }

  return (
    <div className="space-y-6">
      {(schema.title || schema.description) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          {schema.title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {schema.title}
            </h3>
          )}
          {schema.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {schema.description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">
        {Object.entries(schema.properties).map(([propertyName, propertySchema]) => (
          <SchemaField
            key={propertyName}
            schema={propertySchema}
            path={[...path, propertyName]}
            value={value[propertyName]}
            onChange={handlePropertyChange(propertyName)}
            errors={errors.filter(error => error.path[path.length] === propertyName)}
            required={schema.required?.includes(propertyName)}
          />
        ))}
      </div>
    </div>
  );
};
