import React, { useState } from "react";
import { LabeledNumberInput as LabeledNumericInput } from "../common/labeledinput";
import { useObservable } from "src/hooks/observable";

export type SettingsProps = {
   gridSize: number
   mineCount: number
   onSettingsUpdate: (newGridSize: number, newMineCount: number) => void
}

export function Settings(props: SettingsProps) {
   const [settingsChanged, setSettingsChanged] = useState(false);
   const onSettingsChanged = () => setSettingsChanged(true);

   const [gridSize, setGridSize] = useObservable(props.gridSize, onSettingsChanged);
   const [mineCount, setMineCount] = useObservable(props.mineCount, onSettingsChanged);

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      props.onSettingsUpdate(gridSize, mineCount);
      setSettingsChanged(false);
   }

   return (
      <form onSubmit={handleSubmit} autoComplete="off">
         <LabeledNumericInput label="Grid size" value={gridSize} onChange={setGridSize} />
         <LabeledNumericInput label="Mine count" value={mineCount} onChange={setMineCount} />

         <button type="submit">
            {settingsChanged ? "Apply and restart" : "Restart"}
         </button>
      </form>
   );
}