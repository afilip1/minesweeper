import React, { useState, FormEvent } from "react";

type SettingsProps = {
   gridSize: number,
   mineCount: number,
   onSettingsUpdate: (gridSize: number, mineCount: number) => void
};

export function Settings(props: SettingsProps) {
   const [gridSize, setGridSize] = useState(props.gridSize);
   const [mineCount, setMineCount] = useState(props.mineCount);

   const handleGridSizeChange = (event: FormEvent<HTMLInputElement>) => {
      setGridSize(+event.currentTarget.value);
   };

   const handleMineCountChange = (event: FormEvent<HTMLInputElement>) => {
      setMineCount(+event.currentTarget.value);
   }

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.onSettingsUpdate(gridSize, mineCount);
   }

   return (
      <form onSubmit={handleSubmit}>
         <label>
            Grid size:
            <input name="gridSize" type="text" value={gridSize} onChange={handleGridSizeChange} />
         </label>
         <label>
            Mine count:
            <input name="mineCount" type="text" value={mineCount} onChange={handleMineCountChange} />
         </label>
         <button type="submit">Apply</button>
      </form>
   );
}