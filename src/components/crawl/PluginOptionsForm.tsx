import { useEffect, useState } from 'react';
import { pluginsService } from '../../services/api/plugins';
import { JsonSchemaForm } from '../json-forms/JsonSchemaForm';
import { JSONSchemaDefinition } from '../json-forms/types/schema';

interface PluginOptionsFormProps {
  onChange: (formData: any) => void;
  onValidation: (hasErrors: boolean) => void;
}

export default function PluginOptionsForm({ onChange, onValidation }: PluginOptionsFormProps) {
  const [schema, setSchema] = useState<JSONSchemaDefinition | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const schemaData = await pluginsService.getPluginSchema();
        setSchema(schemaData);
      } catch (error) {
        console.error('Error fetching plugin schema:', error);
      }
    };

    fetchSchema();
  }, []);

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading plugin options...
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <JsonSchemaForm
        schema={schema}
        value={formData}
        onChange={(newData) => {
          setFormData(newData);
          onChange(newData);
        }}
        onError={(errors) => {
          console.log('Validation errors:', errors);
          onValidation(errors.length > 0);
        }}
      />
    </div>
  );
}
