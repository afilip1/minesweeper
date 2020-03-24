import React, { useState } from "react";

export function Settings(props) {
   const [gridSize, setGridSize] = useState(props.gridSize);
   const [mineCount, setMineCount] = useState(props.mineCount);

   const handleGridSizeChange = (event) => {
      setGridSize(+event.target.value);
   };

   const handleMineCountChange = (event) => {
      setMineCount(+event.target.value);
   }

   const handleSubmit = (event) => {
      event.preventDefault();
      props.onSubmit(gridSize, mineCount);
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