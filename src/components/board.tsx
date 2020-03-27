import React from "react";
import { CellHidden, CellRevealed } from "src/components/cell";
import { range } from "src/util";
import { BoardState } from "src/hooks/game";

type RenderCellProps = {
   board: BoardState
   onLeftClick: (i: number) => void
   onRightClick: (e: React.MouseEvent, i: number) => void
   onMiddleOver: (e: React.MouseEvent, i: number) => void
}

function renderCell(props: RenderCellProps, cellId: number) {
   const {
      board: { mines, flagged, revealed, adjacent, dimmed, lastRevealed },
      onLeftClick, onRightClick, onMiddleOver
   } = props;

   if (revealed[cellId]) {
      return (
         <CellRevealed
            key={cellId}
            isMine={mines[cellId]}
            isDimmed={dimmed[cellId]}
            onLeftClick={() => onLeftClick(cellId)}
            onMiddleOver={(e) => onMiddleOver(e, cellId)}
            adjacentCount={adjacent[cellId]}
            isLastRevealed={lastRevealed !== null && lastRevealed === cellId}
         />
      );
   } else {
      return (
         <CellHidden
            key={cellId}
            isDimmed={dimmed[cellId]}
            isFlagged={flagged[cellId]}
            onLeftClick={() => onLeftClick(cellId)}
            onRightClick={(e) => onRightClick(e, cellId)}
         />
      );
   }
}

type BoardProps = { size: number } & RenderCellProps;

function Board({ size, ...props }: BoardProps) {
   const cellIds = range(0, size * size);
   const cells = cellIds.map(id => renderCell(props, id));

   return (
      <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 40px)`, gridAutoRows: "40px" }}>
         {cells}
      </div>
   );
}

export { Board }