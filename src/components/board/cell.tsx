import React, { ReactNode } from "react";
import { BoardState } from "src/hooks/game";
import { renderRevealedCell } from "./revealedcell";
import { renderHiddenCell } from "./hiddencell";

export type Handlers = {
   onLeftClick: (i: number) => void
   onRightClick: (e: React.MouseEvent, i: number) => void
   onMiddleOver: (e: React.MouseEvent, i: number) => void
}

export function renderCell(id: number, board: BoardState, handlers: Handlers) {
   const isRevealed = board.revealed[id];
   const isDimmed = board.dimmed[id];

   return (
      <Cell isDimmed={isDimmed} key={id}>
         {isRevealed
            ? renderRevealedCell(id, board, handlers)
            : renderHiddenCell(id, board, handlers)}
      </Cell>
   );
}

type CellProps = {
   isDimmed: boolean,
   children: ReactNode
};

function Cell({ isDimmed, children }: CellProps) {
   let className = "cell";
   if (isDimmed) className += " cell-dimmed";

   return (
      <div className={className}>
         {children}
      </div>
   );
}
