import React from "react";
import { useCookies } from "react-cookie";
import "src/util"
import { ControlPanel } from "src/components/controlpanel";
import { Board } from "src/components/board";
import { useGame } from "src/hooks/game"
import { resolveSoa } from "dns";

export function Game() {
   const [cookies, setCookie] = useCookies(["minekong"]);

   const initSize = cookies.size ?? 9;
   const initMineCount = cookies.mineCount ?? 10;

   const {
      gridSize,
      mineCount,
      board,
      resetBoard,
      handleCellClick,
      handleCellRightClick,
      getGameState
   } = useGame({ initSize, initMineCount });

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
      setCookie('size', newGridSize);
      setCookie('mineCount', newMineCount);
      resetBoard(newGridSize, newMineCount);
   }

   return (
      <div className="game" onContextMenu={(e) => e.preventDefault()}>
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
            onClick={handleCellClick}
            onRightClick={handleCellRightClick}
         />
      </div>
   );
}