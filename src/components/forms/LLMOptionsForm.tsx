import React from 'react';
import Editor from "@monaco-editor/react";

export interface LLMOptions {
  llmModel?: string;
  extractorSchema?: string;
}

interface LLMOptionsFormProps {
  options: LLMOptions;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const llmModels = [
  { value: 'gpt-4o', label: 'GPT-4O' },
  { value: 'gpt-4o-mini', label: 'GPT-4O Mini' }
];

export const LLMOptionsForm: React.FC<LLMOptionsFormProps> = ({ options, onChange }) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange({
      target: {
        name: 'extractorSchema',
        value: value || ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="grid grid-cols-1  gap-8">
      {/* Left Side - Input Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="llmModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LLM Model
          </label>
          <select
            name="llmModel"
            id="llmModel"
            value={options.llmModel}
            onChange={(e) => (
              onChange({
                target: {
                  name: 'llmModel',
                  value: e.target.value
                }
              } as React.ChangeEvent<HTMLInputElement>)
            )}
            className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
          >
            <option value="">Select a model</option>
            {llmModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="extractorSchema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Extractor Schema (JSON)
          </label>
          <div className="h-[300px] border rounded-md overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={options.extractorSchema}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
