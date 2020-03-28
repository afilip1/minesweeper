import React from "react";
import { BoardState } from "src/hooks/game";
import { Handlers } from "./cell";

export function renderRevealedCell(id: number, board: BoardState, handlers: Handlers) {
   const isMine = board.mines[id];
   const adjacentCount = board.adjacent[id] as number;
   const isLastRevealed = board.lastRevealed === id;

   const onLeftClick = () => handlers.onLeftClick(id);
   const onMiddleOver = (e: React.MouseEvent) => handlers.onMiddleOver(e, id);

   return <RevealedCell {...{ isMine, isLastRevealed, adjacentCount, onLeftClick, onMiddleOver }} />;
}

type RevealedCellProps = {
   isMine: boolean
   isLastRevealed: boolean
   adjacentCount: number
   onLeftClick: () => void
   onMiddleOver: (e: React.MouseEvent) => void
}

function RevealedCell({ isMine, isLastRevealed, adjacentCount, onLeftClick, onMiddleOver }: RevealedCellProps) {
   return (
      <div
         className="cell-inner cell-revealed"
         onClick={onLeftClick}
         onMouseEnter={onMiddleOver}
         onMouseDown={onMiddleOver}
      >
         {isMine
            ? (isLastRevealed ? "💥" : "💣")
            : (adjacentCount > 0 && adjacentCount)}
      </div>
   );
}