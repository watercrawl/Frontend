import React, { useEffect, useState } from 'react';
import { JSONSchemaDefinition, ValidationError } from './types/schema';
import { validateValue } from './utils/validation';
import { SchemaField } from './fields/SchemaField';

interface JsonSchemaFormProps {
  schema: JSONSchemaDefinition;
  value?: any;
  onChange: (value: any) => void;
  onError?: (errors: ValidationError[]) => void;
}

export const JsonSchemaForm: React.FC<JsonSchemaFormProps> = ({
  schema,
  value,
  onChange,
  onError,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Initialize default values
  useEffect(() => {
    if (value === undefined && schema.default !== undefined) {
      onChange(schema.default);
    } else if (schema.type === 'object' && value === undefined) {
      // Initialize empty object with default values from properties
      const defaultValue: Record<string, any> = {};
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([key, propSchema]) => {
          if (propSchema.default !== undefined) {
            defaultValue[key] = propSchema.default;
          } else if (propSchema.type === 'object' && propSchema.properties) {
            // Recursively initialize nested objects
            const nestedDefault: Record<string, any> = {};
            Object.entries(propSchema.properties).forEach(([nestedKey, nestedSchema]) => {
              if (nestedSchema.default !== undefined) {
                nestedDefault[nestedKey] = nestedSchema.default;
              }
            });
            if (Object.keys(nestedDefault).length > 0) {
              defaultValue[key] = nestedDefault;
            }
          }
        });
      }
      if (Object.keys(defaultValue).length > 0) {
        onChange(defaultValue);
      }
    }
  }, [schema, value, onChange]);

  useEffect(() => {
    const validationErrors = validateValue(value, schema);
    setErrors(validationErrors);
    onError?.(validationErrors);
  }, [value, schema, onError]);

  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  return (
    <div className="space-y-6">
      <SchemaField
        schema={schema}
        path={[]}
        value={value}
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );
};
