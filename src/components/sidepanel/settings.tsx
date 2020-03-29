import React, { useState } from "react";
import { LabeledNumericInput } from "../common/labeledinput";
import styled from "styled-components";
import { Preset } from "./preset";

const SettingsGrid = styled.div<{columns: number}>`
   display: grid;
   grid-template-columns: repeat(${props => props.columns}, 1fr);
   gap: 10px;
   margin-bottom: 10px;
`;

const RestartButton = styled.button`
   font-size: 1.2rem;
   font-weight: 700;
   margin: 20px 0;
   width: 100%;
`;

export type SettingsProps = {
   gridSize: number
   mineCount: number
   onSettingsUpdate: (newGridSize: number, newMineCount: number) => void
}

export function Settings(props: SettingsProps) {
   const [gridSize, setGridSize] = useState(props.gridSize);
   const [mineCount, setMineCount] = useState(props.mineCount);

   const handleSelectPreset = (newGridSize: number, newMineCount: number) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);

      props.onSettingsUpdate(newGridSize, newMineCount);
   }

   const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      props.onSettingsUpdate(gridSize, mineCount);
   }

   return (
      <div>
         <SettingsGrid columns={3}>
            <Preset label="Easy" gridSize={9} mineCount={10} onSelectPreset={handleSelectPreset} />
            <Preset label="Harder" gridSize={16} mineCount={40} onSelectPreset={handleSelectPreset} />
            <Preset label="Fuck" gridSize={24} mineCount={99} onSelectPreset={handleSelectPreset} />
         </SettingsGrid>

         <form onSubmit={handleSubmit}>
            <SettingsGrid columns={2}>
               <LabeledNumericInput label="Grid size" value={gridSize} onChange={setGridSize} />
               <LabeledNumericInput label="Mine count" value={mineCount} onChange={setMineCount} />
            </SettingsGrid>

            <RestartButton>Restart</RestartButton>
         </form>
      </div >
   );
}
