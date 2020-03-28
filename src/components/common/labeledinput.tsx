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

type LabeledNumberInputProps = {
   label: string
   value: number
   onChange: (value: number) => void
}

export function LabeledNumberInput({ label, value, onChange }: LabeledNumberInputProps) {
   const onInputChange = (e: React.FormEvent<HTMLInputElement>) =>
      onChange(+e.currentTarget.value);

   return (
      <label>
         {label}
         <input type="number" value={value} onChange={onInputChange} />
      </label>
   );
}