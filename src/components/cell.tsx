import React, { ReactNode } from "react";

type CellProps = {
   isRevealed: boolean,
   isDimmed: boolean,
   onLeftClick: () => void
   onRightClick: (e: React.MouseEvent) => void
   onMiddleOver: (e: React.MouseEvent) => void
   children: ReactNode
};

function Cell({ isRevealed, isDimmed, onLeftClick, onRightClick, onMiddleOver, children }: CellProps) {
   let className = "cell cell-active";
   if (isRevealed) className += " cell-revealed";
   if (isDimmed) className += " cell-dimmed";

   return (
      <button
         className={className}
         onClick={onLeftClick}
         onContextMenu={onRightClick}
         onMouseEnter={onMiddleOver}
         onMouseDown={onMiddleOver}
      >
         {children}
      </button>
   );
}

type CellHiddenProps = {
   isFlagged: boolean,
   isDimmed: boolean,
   onLeftClick: () => void,
   onRightClick: (e: React.MouseEvent) => void,
};

function CellHidden({ isFlagged, isDimmed, onLeftClick, onRightClick }: CellHiddenProps) {
   return (
      <Cell
         isRevealed={false}
         isDimmed={isDimmed}
         onLeftClick={onLeftClick}
         onRightClick={onRightClick}
         onMiddleOver={() => { }}
      >
         {isFlagged && "🚩"}
      </Cell>
   );
}

type CellRevealedProps = {
   isMine: boolean,
   isDimmed: boolean,
   adjacentCount: number | null,
   onLeftClick: () => void,
   onMiddleOver: (e: React.MouseEvent) => void,
   isLastRevealed: boolean
};

function CellRevealed({ isMine, isDimmed, isLastRevealed, adjacentCount, onLeftClick, onMiddleOver }: CellRevealedProps) {
   const countColors = [undefined, "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];

   return (
      <Cell
         isRevealed={true}
         isDimmed={isDimmed}
         onLeftClick={onLeftClick}
         onRightClick={(e) => e.preventDefault()}
         onMiddleOver={onMiddleOver}
      >
         {isMine && (isLastRevealed ? "💥" : "💣")}
         {adjacentCount !== null && adjacentCount > 0 &&
            <span style={{ color: countColors[adjacentCount] }}>{adjacentCount}</span>
         }
      </Cell>
   );
};

export { CellHidden, CellRevealed };