import React from "react";
import styled from "styled-components";

const StyledPreset = styled.div`
   padding: 10px;

   color: white;
   background-color: ${({ theme }) => theme.secondary};

   box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
   
   transition: filter 0.5s ease;

   &:active {
      transition: filter 0s;
      filter: brightness(1.2);
   }
`;

type PresetProps = {
   label: string
   gridSize: number
   mineCount: number

   onSelectPreset: (gridSize: number, mineCount: number) => void
}

export function Preset({ label, gridSize, mineCount, onSelectPreset }: PresetProps) {
   return (
      <StyledPreset onClick={() => onSelectPreset(gridSize, mineCount)}>
         <strong>
            {label}
         </strong><br />
         <small>
            {gridSize}x{gridSize}<br />
            {mineCount} mines
         </small>
      </StyledPreset>
   );
}
