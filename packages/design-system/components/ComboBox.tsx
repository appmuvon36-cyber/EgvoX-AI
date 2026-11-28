import React from 'react';
import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput';

export interface ComboBoxOption {
  value: string;
  label?: string;
}

export interface ComboBoxProps extends Omit<TextInputProps, 'list'> {
  id: string;
  options: ComboBoxOption[];
}

export function ComboBox({ id, options, ...props }: ComboBoxProps) {
  const listId = `${id}-options`;
  return (
    <>
      <TextInput id={id} list={listId} role="combobox" aria-autocomplete="list" aria-controls={listId} {...props} />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </datalist>
    </>
  );
}
