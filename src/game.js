import React, { useState, useCallback } from "react";
import "./util"
import { Settings } from "./settings";
import { Board } from "./board";
import { useGrid } from "./grid";

export function Game() {
   const {
      gridSize,
      setGridSize,
      indexToCoords,
      coordsToIndex,
      getNeighbors
   } = useGrid(9);

   const totalCells = gridSize * gridSize
   const initialBoardState = {
      mines: [],
      revealed: Array(totalCells).fill(false),
      flagged: Array(totalCells).fill(false),
      adjacent: [],
   };

   const [board, setBoard] = useState(initialBoardState);
   const resetBoard = () => setBoard(initialBoardState);

   const [mineCount, setMineCount] = useState(10);
   const [firstClick, setFirstClick] = useState(null);

   const generateAdjacentCounts = useCallback((mines) =>
      [...mines.entries()].map(([index, mine]) => {
         if (mine) {
            return null;
         }

         const center = indexToCoords(index, gridSize);
         const neighbors = getNeighbors(center, gridSize);

         const adjacentCount =
            neighbors
               .map((coords) => coordsToIndex(coords, gridSize))
               .map((index) => mines[index])
               .filter(Boolean)
               .length

         return adjacentCount;
      }), [gridSize, indexToCoords, coordsToIndex, getNeighbors]);

   const populateBoard = (firstClickIndex) => {
      const mines = Array(totalCells - 1).fill(true, 0, mineCount).fill(false, mineCount).shuffle();
      mines.splice(firstClickIndex, 0, false); // make sure first clicked cell is never a mine
      const adjacent = generateAdjacentCounts(mines);

      setBoard({ ...board, mines, adjacent });
      setFirstClick(firstClickIndex);
   };


   const checkWinCondition = () => {
      const { mines, revealed, flagged } = board;

      const emptyCells = mines.map(mine => !mine);
      const flaggedAllMines = mines.map((mine, index) => mine && flagged[index]).equals(mines);

      if (revealed.equals(emptyCells) && flaggedAllMines) {
         return true;
      }

      // if a mine is revealed
      if (revealed.some((isRevealed, index) => isRevealed && mines[index])) {
         return false;
      }

      return null;
   };


   const handleClick = (i) => {
      if (checkWinCondition() !== null) return;

      if (board.mines.length === 0) {
         populateBoard(i);
         return;
      }

      let nextRevealed;
      if (board.mines[i]) {
         // reveal mines while keeping previously revealed cells
         nextRevealed = board.revealed.map((e, i) => e || board.mines[i]);
      } else {
         // empty cell
         nextRevealed = board.revealed.slice();
         nextRevealed[i] = true;

         let clickedCellCoords = indexToCoords(i, gridSize);
         let queue = [clickedCellCoords];

         while (queue.length > 0) {
            let centerCoords = queue.shift();
            nextRevealed[coordsToIndex(centerCoords, gridSize)] = true;

            let neighbors = getNeighbors(centerCoords, gridSize);
            if (neighbors.every(n => board.mines[coordsToIndex(n, gridSize)] === false)) {
               queue.push(...neighbors.filter(n => !nextRevealed[coordsToIndex(n, gridSize)]));
            }
         }
      }

      setBoard({ ...board, revealed: nextRevealed });
   };

   if (firstClick) {
      handleClick(firstClick);
      setFirstClick(null);
   }


   const handleRightClick = (event, cellIndex) => {
      event.preventDefault();
      if (checkWinCondition() !== null) return;

      let nextFlagged = board.flagged.slice();
      nextFlagged[cellIndex] = !nextFlagged[cellIndex];
      setBoard({ ...board, flagged: nextFlagged });
   };

   const handleSubmit = (newGridSize, newMineCount) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);
      resetBoard();
   };


   const status = checkWinCondition();

   return (
      <div>
         <Settings gridSize={gridSize} mineCount={mineCount} onSubmit={handleSubmit} />
         <h1>Status: {
            status
               ? "Won"
               : (status === false)
                  ? "Lost"
                  : "Playing"
         }
         </h1>

         <Board
            size={gridSize}
            mines={board.mines}
            flagged={board.flagged}
            revealed={board.revealed}
            adjacent={board.adjacent}
            onClick={handleClick}
            onRightClick={handleRightClick}
         />

         <button onClick={resetBoard}>
            Restart
         </button>
      </div>
   );
}