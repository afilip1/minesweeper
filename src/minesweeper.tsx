import React, { useState, useCallback, SyntheticEvent } from "react";
import "./util"
import { Settings } from "./settings";
import { Board } from "./board";
import { useGrid } from "./grid";

enum GameState {
   InProgress,
   Won,
   Lost,
}
type BoardState = {
   mines: boolean[],
   revealed: boolean[],
   flagged: boolean[],
   adjacent: (number | null)[]
};
export function Minesweeper() {
   const {
      gridSize,
      setGridSize,
      getNeighbors
   } = useGrid(20);

   const getInitialBoardState = (size: number) => ({
      mines: [],
      revealed: Array(size * size).fill(false),
      flagged: Array(size * size).fill(false),
      adjacent: [],
   }) as BoardState;

   const [board, setBoard] = useState(getInitialBoardState(gridSize));
   const resetBoard = (size: number) => setBoard(getInitialBoardState(size));

   const [mineCount, setMineCount] = useState(30);

   const generateAdjacentCounts = useCallback((mines: boolean[]) =>
      mines.withIndex().map(([cell, mine]) =>
         mine
            ? null
            : getNeighbors(cell).countBy((n) => mines[n])
      ), [getNeighbors]);

   const populateBoard = (firstClickedCell: number) => {
      const mines = Array((gridSize * gridSize) - 1)
         .fill(true, 0, mineCount)
         .fill(false, mineCount)
         .shuffle();
      mines.splice(firstClickedCell, 0, false); // make sure first clicked cell is never a mine

      const adjacent = generateAdjacentCounts(mines);

      return { ...board, mines, adjacent };
   };

   const getGameState = () => {
      const { mines, revealed, flagged } = board;

      const emptyCells = mines.map(isMine => !isMine);
      const flaggedAllMines = mines.equals(flagged);

      if (revealed.equals(emptyCells) && flaggedAllMines) {
         return GameState.Won;
      }

      const mineRevealed = revealed.zip(mines).some(([isRevealed, isMine]) => isRevealed && isMine)
      if (mineRevealed) {
         return GameState.Lost;
      }

      return GameState.InProgress;
   };

   const revealAllMines = (board: BoardState) => {
      const revealed = board.revealed
         .zip(board.mines)
         .map(([isRevealed, isMine]) => isRevealed || isMine);

      return { ...board, revealed };
   }

   const revealCascade = (board: BoardState, ...queue: number[]) => {
      let { revealed } = board;

      queue.forEach(cell => revealed[cell] = true);

      while (queue.length > 0) {
         const center = queue.shift() as number;

         if (board.adjacent[center] === 0) {
            const unrevealed = getNeighbors(center).filter(n => !revealed[n]);
            unrevealed.forEach(u => revealed[u] = true);
            queue.push(...unrevealed);
         }
      }

      return { ...board, revealed };
   }

   const revealUnflaggedNeighbors = (board: BoardState, cell: number) => {
      const neighbors = getNeighbors(cell);
      const unflaggedNeighbors = neighbors.filter(n => !(board.revealed[n] || board.flagged[n]));

      return revealCascade(board, ...unflaggedNeighbors);
   }

   const revealCell = (board: BoardState, cell: number) => {
      let nextBoard = revealCascade(board, cell);
      nextBoard.flagged[cell] = false;
      return nextBoard;
   }

   const handleClick = (clickedCell: number) => {
      if (getGameState() !== GameState.InProgress) return;

      const currentBoard = board.mines.length === 0
         ? populateBoard(clickedCell)
         : board;

      let nextBoard: BoardState;
      if (currentBoard.mines[clickedCell]) {
         nextBoard = revealAllMines(currentBoard);
      } else if (currentBoard.revealed[clickedCell]) {
         const neighbors = getNeighbors(clickedCell);

         const adjacentFlags = neighbors.filter(n => currentBoard.flagged[n])
         if (adjacentFlags.length !== currentBoard.adjacent[clickedCell]) return;

         nextBoard = revealUnflaggedNeighbors(currentBoard, clickedCell);
      } else {
         nextBoard = revealCell(currentBoard, clickedCell);
      }

      setBoard(nextBoard);
   };

   const handleRightClick = (event: SyntheticEvent, cellIndex: number) => {
      event.preventDefault();
      if (getGameState() !== GameState.InProgress) return;

      let flagged = board.flagged.slice();
      flagged[cellIndex] = !flagged[cellIndex];
      setBoard({ ...board, flagged });
   };

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);
      resetBoard(newGridSize);
   };

   const state = getGameState();
   let status;
   switch (state) {
      case GameState.InProgress:
         status = "Mines remaining: " + (mineCount - board.flagged.filter(Boolean).length);
         break;
      case GameState.Won:
         status = "You win!"
         break;
      case GameState.Lost:
         status = "You lose :("
         break;
   }

   return (
      <div className="minesweeper" onContextMenu={(e) => e.preventDefault()}>
         <Settings
            gridSize={gridSize}
            mineCount={mineCount}
            onSettingsUpdate={handleSettingsUpdate}
         />


         <h1>{status}</h1>

         <Board
            size={gridSize}
            mines={board.mines}
            flagged={board.flagged}
            revealed={board.revealed}
            adjacent={board.adjacent}
            onClick={handleClick}
            onRightClick={handleRightClick}
         />

         <button onClick={() => resetBoard(gridSize)}>Restart</button>
      </div>
   );
}