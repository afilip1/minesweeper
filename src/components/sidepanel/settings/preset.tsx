import React from "react";
import styled from "styled-components";
import { SubtextButton } from "./subtextbutton";

const PresetButton = styled(SubtextButton)`
   padding: 10px;

   color: white;
   background-color: ${({theme}) => theme.secondary};
`;

type PresetProps = {
   label: string
   gridSize: number
   mineCount: number
   onSelectPreset: (gridSize: number, mineCount: number) => void
}

export function Preset({ label, gridSize, mineCount, onSelectPreset }: PresetProps) {
   return (
      <PresetButton
         label={label}
         onClick={() => onSelectPreset(gridSize, mineCount)}
      >
         {gridSize}x{gridSize}<br />
         {mineCount} mines
      </PresetButton>
   );
}
