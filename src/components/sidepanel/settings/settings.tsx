import React, { useState } from "react";
import { LabeledNumericInput } from "./labeledinput";
import styled from "styled-components";
import { Preset } from "./preset";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "src/store";

const StyledSettings = styled.div`
   grid-area: settings;

   padding: 0 30px;
`;

const SettingsGrid = styled.div<{ columns: number }>`
   display: grid;
   grid-template-columns: repeat(${props => props.columns}, 1fr);
   gap: 10px;
   margin: 10px 0;
`;

const RestartButton = styled.button`
   font-size: 1.2rem;
   font-weight: 700;
   width: 100%;
`;

export function Settings() {
   const [gridSize, setGridSize] = useState(useSelector((state: AppState) => state.gridSize));
   const [mineCount, setMineCount] = useState(useSelector((state: AppState) => state.mineCount));

   const dispatch = useDispatch();

   const handleSelectPreset = (newGridSize: number, newMineCount: number) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);

      dispatch({ type: "UPDATE_SETTINGS", gridSize: newGridSize, mineCount: newMineCount });
   }

   const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      dispatch({ type: "UPDATE_SETTINGS", gridSize, mineCount });
   }

   return (
      <StyledSettings>
         <form onSubmit={handleSubmit}>
            <SettingsGrid columns={2}>
               <LabeledNumericInput label="Grid size" value={gridSize} onChange={setGridSize} />
               <LabeledNumericInput label="Mine count" value={mineCount} onChange={setMineCount} />
            </SettingsGrid>

            <SettingsGrid columns={3}>
               <Preset label="Easy" gridSize={9} mineCount={10} onSelectPreset={handleSelectPreset} />
               <Preset label="Medium" gridSize={16} mineCount={40} onSelectPreset={handleSelectPreset} />
               <Preset label="Hard" gridSize={24} mineCount={99} onSelectPreset={handleSelectPreset} />
            </SettingsGrid>

            <RestartButton>Restart</RestartButton>
         </form>
      </StyledSettings >
   );
}
