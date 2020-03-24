import React from "react";
import { CellHidden, CellRevealed } from "./cell";

function renderCell({ mines, flagged, revealed, adjacent, onClick, onRightClick }, cellId) {
   if (revealed[cellId]) {
      return (
         <CellRevealed
            key={cellId}
            isMine={mines[cellId]}
            adjacentCount={adjacent[cellId]}
         />
      );
   } else {
      return (
         <CellHidden
            key={cellId}
            isFlagged={flagged[cellId]}
            onClick={() => onClick(cellId)}
            onRightClick={(e) => onRightClick(e, cellId)}
         />
      );
   }
}

export function Board({ size, ...props }) {
   let cellIds = [...Array(size * size).keys()];
   let rowIds = [...Array(size).keys()];

   let board = rowIds.map(rowId =>
      <div className="board-row" key={rowId}>
         {
            cellIds
               .slice(rowId * size, (rowId + 1) * size) // get cells in the row
               .map(cellId => renderCell(props, cellId))
         }
      </div>
   );

   return board;
}