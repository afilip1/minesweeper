import React, { useState, useCallback } from "react";
import "./util"
import { Settings } from "./settings";
import { Board } from "./board";
import { useGrid } from "./grid";

function GameStatus({ gameState }) {
   let possibleStatuses = ["Playing", "You won", "You lost"];

   return <h1>Status: {possibleStatuses[gameState]}</h1>
}

const GameState = {
   InProgress: 0,
   Won: 1,
   Lost: 2,
}

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
   };

   const getGameState = () => {
      const { mines, revealed, flagged } = board;

      const emptyCells = mines.map(mine => !mine);
      const flaggedAllMines = mines.map((mine, index) => mine && flagged[index]).equals(mines);

      if (revealed.equals(emptyCells) && flaggedAllMines) {
         return GameState.Won;
      }

      // if a mine is revealed
      if (revealed.some((isRevealed, index) => isRevealed && mines[index])) {
         return GameState.Lost;
      }

      return GameState.InProgress;
   };

   const revealMines = () => {
      const nextRevealed = board.revealed.map((e, i) => e || board.mines[i]);
      setBoard({ ...board, revealed: nextRevealed });
   }

   const revealUnflaggedNeighbors = (i) => {
      const clickedCellCoords = indexToCoords(i);
      const neighbors = getNeighbors(clickedCellCoords).map(coordsToIndex);

      if (neighbors.filter(n => board.flagged[n]).length !== board.adjacent[i])
         return;

      let nextRevealed = board.revealed.slice();

      let queue = neighbors.filter(n => !(board.revealed[n] || board.flagged[n]));

      while (queue.length > 0) {
         let centerIndex = queue.shift();
         nextRevealed[centerIndex] = true;

         let neighbors = getNeighbors(indexToCoords(centerIndex), gridSize);
         if (board.adjacent[centerIndex] === 0) {
            queue.push(...neighbors.filter(n => !nextRevealed[coordsToIndex(n, gridSize)]).map(coordsToIndex));
         }
      }
      setBoard({ ...board, revealed: nextRevealed });
   }

   const revealCell = (i) => {
      // empty cell
      let nextRevealed = board.revealed.slice();
      nextRevealed[i] = true;

      let clickedCellCoords = indexToCoords(i, gridSize);
      let queue = [clickedCellCoords];

      while (queue.length > 0) {
         let centerCoords = queue.shift();
         nextRevealed[coordsToIndex(centerCoords, gridSize)] = true;

         let neighbors = getNeighbors(centerCoords, gridSize);
         if (board.adjacent[coordsToIndex(centerCoords)] === 0) {
            queue.push(...neighbors.filter(n => !nextRevealed[coordsToIndex(n, gridSize)]));
         }
      }
      setBoard({ ...board, revealed: nextRevealed });
   }

   const handleClick = (i) => {
      if (getGameState() !== GameState.InProgress) return;

      if (board.mines.length === 0) {
         populateBoard(i);
         setFirstClick(i);
         return;
      }

      if (board.mines[i]) {
         revealMines();
      }
      else if (board.revealed[i]) {
         revealUnflaggedNeighbors(i);
      } else {
         revealCell(i);
      }
   };

   if (firstClick) {
      handleClick(firstClick);
      setFirstClick(null);
   }

   const handleRightClick = (event, cellIndex) => {
      event.preventDefault();
      if (getGameState() !== GameState.InProgress) return;

      let flagged = board.flagged.slice();
      flagged[cellIndex] = !flagged[cellIndex];
      setBoard({ ...board, flagged });
   };

   const handleSettingsUpdate = (newGridSize, newMineCount) => {
      setGridSize(newGridSize);
      setMineCount(newMineCount);
      resetBoard();
   };

   return (
      <div>
         <Settings gridSize={gridSize} mineCount={mineCount} onSettingsUpdate={handleSettingsUpdate} />
         <GameStatus gameState={getGameState()} />

         <Board
            size={gridSize}
            mines={board.mines}
            flagged={board.flagged}
            revealed={board.revealed}
            adjacent={board.adjacent}
            onClick={handleClick}
            onRightClick={handleRightClick}
         />

         <button onClick={resetBoard}>Restart</button>
      </div>
   );
}