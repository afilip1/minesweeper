import React, { ReactEventHandler, ReactNode } from "react";

type CellProps = {
   isRevealed: boolean,
   onClick: ReactEventHandler
   onRightClick: ReactEventHandler
   children: ReactNode
};

function Cell({ isRevealed, onClick, onRightClick, children }: CellProps) {
   let className = "cell";
   if (isRevealed) className += " cell-revealed";

   return (
      <button
         className={className}
         onClick={onClick}
         onContextMenu={onRightClick}
      >
         {children}
      </button>
   );
}

type CellHiddenProps = {
   isFlagged: boolean,
   onClick: ReactEventHandler,
   onRightClick: ReactEventHandler,
};

function CellHidden({ isFlagged, onClick, onRightClick }: CellHiddenProps) {
   return (
      <Cell
         isRevealed={false}
         onClick={onClick}
         onRightClick={onRightClick}
      >
         {isFlagged && "🚩"}
      </Cell>
   );
}

type CellRevealedProps = {
   isMine: boolean,
   adjacentCount: number | null,
   onClick: ReactEventHandler,
};

function CellRevealed({ isMine, adjacentCount, onClick }: CellRevealedProps) {
   const countColors = [undefined, "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];

   return (
      <Cell
         isRevealed={true}
         onClick={onClick}
         onRightClick={(e) => e.preventDefault()}
      >
         {isMine && "💣"}
         {adjacentCount !== null && adjacentCount > 0 &&
            <span style={{ color: countColors[adjacentCount] }}>{adjacentCount}</span>
         }
      </Cell>
   );
};

export { CellHidden, CellRevealed };