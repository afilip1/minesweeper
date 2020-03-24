import React from "react";

export function Cell({ isRevealed, onClick, onRightClick, children }) {
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

export function CellHidden({ isFlagged, onClick, onRightClick }) {
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

export function CellRevealed({ isMine, adjacentCount }) {
   return (
      <Cell
         isRevealed={true}
         onRightClick={(e) => e.preventDefault()}
      >
         {isMine && "💣"}
         {adjacentCount > 0 && adjacentCount}
      </Cell>
   );
}
