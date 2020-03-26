import React, { SyntheticEvent } from "react";
import { CellHidden, CellRevealed } from "src/components/cell";
import { range } from "src/util";
import { BoardState } from "src/hooks/game";

type RenderCellProps = {
   board: BoardState,
   onClick: (i: number) => void,
   onRightClick: (e: SyntheticEvent, i: number) => void,
};

function renderCell(props: RenderCellProps, cellId: number) {
   const {
      board: { mines, flagged, revealed, adjacent },
      onClick, onRightClick
   } = props;

   if (revealed[cellId]) {
      return (
         <CellRevealed
            key={cellId}
            isMine={mines[cellId]}
            onClick={() => onClick(cellId)}
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

type BoardProps = { size: number } & RenderCellProps;

export function Board({ size, ...props }: BoardProps) {
   let cellIds = range(0, size * size);
   let rowIds = range(0, size);

   let rows = rowIds.map(rowId =>
      <div className="board-row" key={rowId}>
         {
            cellIds
               .slice(rowId * size, (rowId + 1) * size) // get cells in the row
               .map(cellId => renderCell(props, cellId))
         }
      </div>
   );

   return <div className="board">{rows}</div>;
}