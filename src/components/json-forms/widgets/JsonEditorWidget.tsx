import React, { useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FieldProps } from '../types/schema';

export const JsonEditorWidget: React.FC<FieldProps> = ({
  schema,
  value,
  onChange,
  errors,
}) => {
  const hasError = errors && errors.length > 0;
  const ui = schema.ui || {};
  
  // Initialize default value
  useEffect(() => {
    if (value === undefined) {
      if (schema.default !== undefined) {
        onChange(schema.default);
      } else if (schema.type === 'object' && schema.properties) {
        // Initialize with default values from properties
        const defaultValue: Record<string, any> = {};
        Object.entries(schema.properties).forEach(([key, propSchema]) => {
          if (propSchema.default !== undefined) {
            defaultValue[key] = propSchema.default;
          }
        });
        if (Object.keys(defaultValue).length > 0) {
          onChange(defaultValue);
        }
      }
    }
  }, [schema, value, onChange]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    try {
      if (!value) {
        onChange({});
        return;
      }
      const parsedValue = JSON.parse(value);
      onChange(parsedValue);
    } catch (error) {
      // Don't update the value if JSON is invalid
      console.error('Invalid JSON:', error);
    }
  }, [onChange]);

  const stringifiedValue = React.useMemo(() => {
    try {
      return JSON.stringify(value || {}, null, 2);
    } catch (error) {
      return '';
    }
  }, [value]);

  return (
    <div className={`relative ${hasError ? 'border border-red-500 rounded-md' : ''}`}>
      <Editor
        height={ui.editorHeight || "200px"}
        defaultLanguage="json"
        value={stringifiedValue}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: ui.fontSize || 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: schema.readOnly,
          ...ui.editorOptions,
        }}
      />
    </div>
  );
};
