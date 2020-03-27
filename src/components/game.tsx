import React from "react";
import "src/util"
import { ControlPanel } from "src/components/controlpanel";
import { Board } from "src/components/board";
import { useGame } from "src/hooks/game"
import { useLocalStorageNumber } from "src/hooks/localstorage";

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

   return (
      <div className="game" onContextMenu={(e) => e.preventDefault()} onMouseUp={handleMouseUp}>
         <ControlPanel
            gridSize={gridSize}
            mineCount={mineCount}
            gameState={getGameState()}
            minesLeft={mineCount - board.flagged.countBy(Boolean)}
            onSettingsUpdate={handleSettingsUpdate}
         />

         <Board
            size={gridSize}
            board={board}
            onLeftClick={handleLeftClick}
            onRightClick={handleRightClick}
            onMiddleOver={handleMiddleOver}
         />
      </div>
   );
}