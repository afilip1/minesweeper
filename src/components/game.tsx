import React from "react";
import { useCookies } from "react-cookie";
import "src/util"
import { ControlPanel } from "src/components/controlpanel";
import { Board } from "src/components/board";
import { useGame } from "src/hooks/game"

export function Game() {
   const [cookies, setCookie] = useCookies(["minekong"]);

   const initSize = cookies.size ?? 9;
   const initMineCount = cookies.mineCount ?? 10;

   const {
      gridSize,
      mineCount,
      board,
      resetBoard,
      handleCellLeftClick,
      handleCellRightClick,
      handleCellMiddleOver,
      handleMiddleUp,
      getGameState,
   } = useGame({ initSize, initMineCount });

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
      setCookie('size', newGridSize);
      setCookie('mineCount', newMineCount);
      resetBoard(newGridSize, newMineCount);
   }

   const handleMouseUp = (e: React.MouseEvent) => {
      if (e.button === 1) {
         handleMiddleUp();
      }
   }

   const handleMiddleOver = (e: React.MouseEvent, i: number) => {
      if (e.buttons === 4) {
         handleCellMiddleOver(i);
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
            onLeftClick={handleCellLeftClick}
            onRightClick={handleCellRightClick}
            onMiddleOver={handleMiddleOver}
         />
      </div>
   );
}