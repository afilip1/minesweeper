import React from "react";

type LabeledTextInputProps = {
   label: string
   value: string
   onChange: (value: string) => void
}

export function LabeledTextInput({ label, value, onChange }: LabeledTextInputProps) {
   const onInputChange = (e: React.FormEvent<HTMLInputElement>) =>
      onChange(e.currentTarget.value);

   return (
      <label>
         {label}
         <input type="text" value={value} onChange={onInputChange} />
      </label>
   );
}

type LabeledNumericInputProps = {
   label: string
   value: number
   onChange: (value: number) => void
}

export function LabeledNumericInput({ label, value, onChange }: LabeledNumericInputProps) {
   const onInputChange = (e: React.FormEvent<HTMLInputElement>) =>
      onChange(+e.currentTarget.value);

   return (
      <label>
         {label}
         <input type="number" value={value} onChange={onInputChange} />
      </label>
   );
}