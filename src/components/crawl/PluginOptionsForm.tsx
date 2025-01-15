import { JsonSchemaForm } from '../json-forms/JsonSchemaForm';
import { JSONSchemaDefinition } from '../json-forms/types/schema';
import { OptionGroup } from '../shared/FormComponents';

interface PluginOptionsFormProps {
  onChange: (formData: any) => void;
  onValidation: (hasErrors: boolean) => void;
  schema: JSONSchemaDefinition | null;
  value: any;
}

export default function PluginOptionsForm({ onChange, onValidation, schema, value }: PluginOptionsFormProps) {
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
    <OptionGroup
      title="Plugin Configuration"
      description="Configure settings for enabled plugins"
    >
      <JsonSchemaForm
        schema={schema}
        value={value}
        onChange={onChange}
        onError={(errors) => {
          if (errors.length > 0) {
            console.log('Validation errors:', errors);
          }
          onValidation(errors.length > 0);
        }}
      />
    </OptionGroup>
  );
}
