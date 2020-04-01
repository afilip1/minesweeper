import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
   width: 100%;
   font-size: 1.5rem;
   border: none;
   border-bottom: 3px solid ${({theme}) => theme.secondary};
   outline: none;
`;

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
         <StyledInput type="text" value={value} onChange={onInputChange} />
      </label>
   );
}