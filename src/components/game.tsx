import React from "react";
import "src/util"
import { ControlPanel } from "src/components/controlpanel";
import { Board } from "src/components/board";
import { useGame } from "src/hooks/game"

export function Game() {
   const {
      gridSize,
      mineCount,
      board,
      resetBoard,
      handleCellClick,
      handleCellRightClick,
      getGameState
   } = useGame({ initSize: 9, initMineCount: 10 });

   return (
      <div className="game" onContextMenu={(e) => e.preventDefault()}>
         <ControlPanel
            gridSize={gridSize}
            mineCount={mineCount}
            gameState={getGameState()}
            minesLeft={mineCount - board.flagged.countBy(Boolean)}
            onSettingsUpdate={resetBoard}
            onRestart={() => resetBoard(gridSize, mineCount)}
         />

         <Board
            size={gridSize}
            board={board}
            onClick={handleCellClick}
            onRightClick={handleCellRightClick}
         />
      </div>
   );
}