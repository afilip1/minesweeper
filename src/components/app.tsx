import React from "react";
import "src/util"
import { SidePanel } from "src/components/sidepanel/sidepanel";
import { useGame } from "src/hooks/game"
import { Board } from "./board/board";
import styled from "styled-components";

const StyledApp = styled.div`
   display: grid;
   grid-template-columns: 360px auto;
`;

export function App() {
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
   } = useGame({ initSize: 9, initMineCount: 10 });

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
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
      <StyledApp onContextMenu={(e) => e.preventDefault()} onMouseUp={handleMouseUp} onMouseDown={preventScrolling}>
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
      </StyledApp>
   );
}
