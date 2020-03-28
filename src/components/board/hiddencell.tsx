import React from "react";
import { BoardState } from "src/hooks/game";
import { Handlers } from "./cell";

export function renderHiddenCell(id: number, board: BoardState, handlers: Handlers) {
   const isFlagged = board.flagged[id];

   const onLeftClick = () => handlers.onLeftClick(id);
   const onRightClick = (e: React.MouseEvent) => handlers.onRightClick(e, id);

   return <HiddenCell {...{ isFlagged, onLeftClick, onRightClick }} />
}

type HiddenCellProps = {
   isFlagged: boolean,
   onLeftClick: () => void,
   onRightClick: (e: React.MouseEvent) => void
}

function HiddenCell({ isFlagged, onLeftClick, onRightClick }: HiddenCellProps) {
   let className = "cell-inner cell-hidden";
   if (isFlagged) className += " cell-flagged";

   return (
      <div
         className={className}
         onClick={onLeftClick}
         onContextMenu={onRightClick}
      />
   );
}
