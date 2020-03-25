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

function GameStatus({ gameState }: { gameState: GameState }) {
   let possibleStatuses = ["Playing", "You won", "You lost"];

   return <h1>Status: {possibleStatuses[gameState]}</h1>
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
   } = useGrid(9);

   const totalCells = gridSize * gridSize
   const initialBoardState: BoardState = {
      mines: [],
      revealed: Array(totalCells).fill(false),
      flagged: Array(totalCells).fill(false),
      adjacent: [],
   };
   const [board, setBoard] = useState(initialBoardState);
   const resetBoard = () => setBoard(initialBoardState);

   const [mineCount, setMineCount] = useState(10);
   const [firstClick, setFirstClick] = useState<number | null>(null);

   const generateAdjacentCounts = useCallback((mines) =>
      [...mines.entries()].map(([index, mine]) => {
         if (mine) {
            return null;
         }

         const neighbors = getNeighbors(index);

         const adjacentCount =
            neighbors
               .map((index) => mines[index])
               .filter(Boolean)
               .length

         return adjacentCount;
      }), [getNeighbors]);

   const populateBoard = (firstClickIndex: number) => {
      const mines = Array(totalCells - 1).fill(true, 0, mineCount).fill(false, mineCount).shuffle();
      mines.splice(firstClickIndex, 0, false); // make sure first clicked cell is never a mine
      const adjacent = generateAdjacentCounts(mines);

      setBoard({ ...board, mines, adjacent });
   };

   const getGameState = () => {
      const { mines, revealed, flagged } = board;

      const emptyCells = mines.map(isMine => !isMine);
      const flaggedAllMines = mines
         .zip(flagged)
         .map(([isMine, isFlagged]) => isMine && isFlagged)
         .equals(mines); // workaround for revealed cells that remain flagged

      if (revealed.equals(emptyCells) && flaggedAllMines) {
         return GameState.Won;
      }

      const mineRevealed = revealed.zip(mines).some(([isRevealed, isMine]) => isRevealed && isMine)
      if (mineRevealed) {
         return GameState.Lost;
      }

      return GameState.InProgress;
   };

   const revealMines = () => {
      const revealed = board.revealed
         .zip(board.mines)
         .map(([isRevealed, isMine]) => isRevealed || isMine);

      setBoard({ ...board, revealed });
   }

   const revealUnflaggedNeighbors = (i: number) => {
      const neighbors = getNeighbors(i);

      if (neighbors.filter(n => board.flagged[n]).length !== board.adjacent[i])
         return;

      let nextRevealed = board.revealed.slice();

      let queue = neighbors.filter(n => !(board.revealed[n] || board.flagged[n]));

      while (queue.length > 0) {
         let centerIndex = queue.shift() as number;
         nextRevealed[centerIndex] = true;

         let neighbors = getNeighbors(centerIndex);
         if (board.adjacent[centerIndex] === 0) {
            queue.push(...neighbors.filter(n => !nextRevealed[n]));
         }
      }
      setBoard({ ...board, revealed: nextRevealed });
   }

   const revealCell = (i: number) => {
      // empty cell
      let nextRevealed = board.revealed.slice();

      let queue = [i];
      while (queue.length > 0) {
         let centerIndex = queue.shift() as number;
         nextRevealed[centerIndex] = true;

         let neighbors = getNeighbors(centerIndex);
         if (board.adjacent[centerIndex] === 0) {
            queue.push(...neighbors.filter(n => !nextRevealed[n]));
         }
      }
      setBoard({ ...board, revealed: nextRevealed });
   }

   const handleClick = (i: number) => {
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