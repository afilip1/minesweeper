import React, { useState } from "react";
import { LabeledNumericInput } from "../common/labeledinput";
import { SquareGrid } from "../common/squaregrid";
import { useObservable } from "src/hooks/observable";
import { SubtextButton } from "../common/subtextbutton";

type Settings = {
   gridSize: number
   mineCount: number
}

export type ControlPanelProps = {
   onSettingsUpdate: (newGridSize: number, newMineCount: number) => void
} & Settings

export function ControlPanel(props: ControlPanelProps) {
   const [settingsSynced, setSettingsSynced] = useState(true);
   const onSettingsChanged = () => setSettingsSynced(false);

   const [gridSize, setGridSize] = useObservable(props.gridSize, onSettingsChanged);
   const [mineCount, setMineCount] = useObservable(props.mineCount, onSettingsChanged);

   const [customSettingsOpen, setCustomSettingsOpen] = useState(false);
   const toggleCustomSettings = () => setCustomSettingsOpen(!customSettingsOpen);

   const handleSelectPreset = (newGridSize: number, newMineCount: number) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);
      setSettingsSynced(true);

      props.onSettingsUpdate(newGridSize, newMineCount);
   }

   const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      setSettingsSynced(true);

      props.onSettingsUpdate(gridSize, mineCount);
   }

   return (
      <div>
         <SquareGrid size={2}>
            <Preset label="Easy" gridSize={9} mineCount={10} onSelectPreset={handleSelectPreset} />
            <Preset label="Medium" gridSize={16} mineCount={40} onSelectPreset={handleSelectPreset} />
            <Preset label="Hard" gridSize={24} mineCount={99} onSelectPreset={handleSelectPreset} />

            <SubtextButton label="Custom" onClick={toggleCustomSettings}>
               {customSettingsOpen ? "Close" : "Open"} settings
            </SubtextButton>
         </SquareGrid>

         {customSettingsOpen &&
            <form id="settings" onSubmit={handleSubmit}>
               <SquareGrid size={2}>
                  <LabeledNumericInput label="Grid size" value={gridSize} onChange={setGridSize} />
                  <LabeledNumericInput label="Mine count" value={mineCount} onChange={setMineCount} />
               </SquareGrid>
            </form>
         }

         <button form="settings" type="submit" onClick={handleSubmit}>
            {settingsSynced
               ? "Restart"
               : "Apply and restart"}
         </button>
      </div >
   );
}

type PresetProps = {
   label: string
   gridSize: number
   mineCount: number
   onSelectPreset: (gridSize: number, mineCount: number) => void
}

function Preset({ label, gridSize, mineCount, onSelectPreset }: PresetProps) {
   return (
      <SubtextButton
         label={label}
         onClick={() => onSelectPreset(gridSize, mineCount)}
      >
         {gridSize}x{gridSize}<br />
         {mineCount} mines
      </SubtextButton>
   );
}
