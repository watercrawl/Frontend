import React from 'react';
import { FieldProps, UIWidgetType } from '../types/schema';
import { TextWidget } from '../widgets/TextWidget';
import { NumberWidget } from '../widgets/NumberWidget';
import { SelectWidget } from '../widgets/SelectWidget';
import { SwitchWidget } from '../widgets/SwitchWidget';
import { TextAreaWidget } from '../widgets/TextAreaWidget';
import { RadioWidget } from '../widgets/RadioWidget';
import { JsonEditorWidget } from '../widgets/JsonEditorWidget';
import { ObjectField } from './ObjectField';
import { ArrayField } from './ArrayField';
import { CheckboxWidget } from '../widgets/CheckboxWidget';

export const SchemaField: React.FC<FieldProps> = (props) => {
  const { schema, errors = [] } = props;
  const hasError = errors.length > 0;
  const ui = schema.ui || {};

  const renderWidget = () => {
    // First check for custom widget
    if (ui.widget) {
      switch (ui.widget) {
        case 'textarea':
          return <TextAreaWidget {...props} />;
        case 'radio':
          return <RadioWidget {...props} />;
        case 'switch':
          return <SwitchWidget {...props} />;
        case 'json-editor':
          return <JsonEditorWidget {...props} />;
        case 'checkbox':
          return <CheckboxWidget {...props} />;
        // Add more custom widgets here
      }
    }

    // Then fall back to default widgets based on schema type and enum
    if (schema.enum) {
      return <SelectWidget {...props} />;
    }

    switch (schema.type) {
      case 'string':
        switch (schema.format) {
          case 'email':
          case 'uri':
          case 'url':
          case 'date':
          case 'time':
          case 'date-time':
          case 'password':
            return <TextWidget {...props} type={schema.format} />;
          default:
            return <TextWidget {...props} />;
        }
      case 'number':
      case 'integer':
        return <NumberWidget {...props} />;
      case 'boolean':
        return ui.widget === 'checkbox' as UIWidgetType ? <CheckboxWidget {...props} /> : <SwitchWidget {...props} />;
      case 'object':
        return ui.widget === 'json-editor' as UIWidgetType ? <JsonEditorWidget {...props} /> : <ObjectField {...props} />;
      case 'array':
        return <ArrayField {...props} />;
      default:
        return null;
    }
  };

  if (schema.type === 'object' && ui.widget === 'json-editor') {
    return renderWidget();
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return renderWidget();
  }

  if (schema.type === 'boolean' && ui.widget !== 'radio') {
    return (
      <div className={`mb-4 ${ui.className || ''}`}>
        {renderWidget()}
        {hasError && (
          <div className={`mt-1 text-sm text-red-500 ${ui.errorClassName || ''}`}>
            {errors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`mb-4 ${ui.className || ''}`}>
      <div className="flex justify-between mb-1">
        {schema.title && (
          <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${ui.labelClassName || ''}`}>
            {schema.title}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {schema.description && (
        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-2 ${ui.descriptionClassName || ''}`}>
          {schema.description}
        </p>
      )}
      {renderWidget()}
      {hasError && (
        <div className={`mt-1 text-sm text-red-500 ${ui.errorClassName || ''}`}>
          {errors.map((error, index) => (
            <div key={index}>{error.message}</div>
          ))}
        </div>
      )}
    </div>
  );
};
