import React from "react";
import "src/util"
import { SidePanel } from "src/components/sidepanel/sidepanel";
import { useGame } from "src/hooks/game"
import { useLocalStorageNumber } from "src/hooks/localstorage";
import { Board } from "./board/board";

export function Game() {
   const [cachedSize, setCachedSize] = useLocalStorageNumber('size', 9);
   const [cachedMineCount, setCachedMineCount] = useLocalStorageNumber('mineCount', 10);

   const {
      gridSize,
      mineCount,
      board,
      resetBoard,
      tryRevealCell,
      tryRevealUnflaggedNeighbors,
      tryFlagCell,
      highlightCells,
      unhighlightCells,
      getGameState,
   } = useGame({ initSize: cachedSize, initMineCount: cachedMineCount });

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
      setCachedSize(newGridSize);
      setCachedMineCount(newMineCount);
      resetBoard(newGridSize, newMineCount);
   }

   const handleMouseUp = (e: React.MouseEvent) => {
      if (e.button === 1) {
         unhighlightCells();
      }
   }

   const handleMiddleOver = (e: React.MouseEvent, i: number) => {
      if (e.buttons === 4) {
         highlightCells(i);
      }
   }

   const handleRightClick = (e: React.MouseEvent, i: number) => {
      e.preventDefault();
      tryFlagCell(i);
   }

   const handleLeftClick = (i: number) => {
      if (board.revealed[i]) {
         tryRevealUnflaggedNeighbors(i);
      } else {
         tryRevealCell(i);
      }
   }

   const preventScrolling = (e: React.MouseEvent) => {
      if (e.buttons === 4) {
         e.preventDefault();
      }
   }

   return (
      <div className="game" onContextMenu={(e) => e.preventDefault()} onMouseUp={handleMouseUp} onMouseDown={preventScrolling}>
         <SidePanel
            gridSize={gridSize}
            mineCount={mineCount}
            gameState={getGameState()}
            minesLeft={mineCount - board.flagged.countBy(Boolean)}
            onSettingsUpdate={handleSettingsUpdate}
         />

         <Board
            gridSize={gridSize}
            boardState={board}
            onLeftClick={handleLeftClick}
            onRightClick={handleRightClick}
            onMiddleOver={handleMiddleOver}
         />
      </div>
   );
}
