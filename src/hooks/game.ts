import { useState, useCallback } from "react";
import { useGrid } from "src/hooks/grid"

export type BoardState = {
   mines: boolean[],
   revealed: boolean[],
   flagged: boolean[],
   adjacent: (number | null)[],
   dimmed: boolean[],
};

export enum GameState {
   InProgress,
   Won,
   Lost,
}

type InitBoardParams = {
   initSize: number,
   initMineCount: number,
};

export function useGame({ initSize, initMineCount }: InitBoardParams) {
   const { gridSize, setGridSize, getNeighbors } = useGrid(initSize);

   const [mineCount, setMineCount] = useState(initMineCount);

   const [firstClick, setFirstClick] = useState<number | null>(null);

   const [mines, setMines] = useState<boolean[]>([]);
   const [adjacent, setAdjacent] = useState<(number | null)[]>([]);
   const [revealed, setRevealed] = useState(Array(gridSize * gridSize).fill(false));
   const [flagged, setFlagged] = useState(Array(gridSize * gridSize).fill(false));
   const [dimmed, setDimmed] = useState(Array(gridSize * gridSize).fill(false));

   const resetBoard = (size: number, mineCount: number) => {
      setGridSize(size);
      setMineCount(mineCount);

      setMines([]);
      setAdjacent([]);
      setRevealed(Array(size * size).fill(false));
      setFlagged(Array(size * size).fill(false));
      setDimmed(Array(size * size).fill(false));
   }

   const populateBoard = useCallback((firstClickedCell: number) => {
      const mines = Array((gridSize * gridSize) - 1)
         .fill(true, 0, mineCount)
         .fill(false, mineCount)
         .shuffle();

      mines.splice(firstClickedCell, 0, false); // make sure first clicked cell is never a mine

      const adjacent = mines.withIndex().map(([cell, mine]) =>
         mine
            ? null
            : getNeighbors(cell).countBy((n) => mines[n])
      );

      setMines(mines);
      setAdjacent(adjacent);
   }, [gridSize, mineCount, getNeighbors]);

   const getGameState = useCallback(() => {
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
   }, [mines, flagged, revealed]);

   const handleCellLeftClick = useCallback((cell: number) => {
      if (getGameState() !== GameState.InProgress) return;

      if (mines.length === 0) {
         populateBoard(cell);
         setFirstClick(cell);
         return;
      }

      const revealAllMines = (cell: number) => {
         const nextRevealed = revealed
            .zip(mines)
            .map(([isRevealed, isMine]) => isRevealed || isMine);

         setRevealed(nextRevealed);

         const highlighted = getNeighbors(cell).concat(cell);

         let nextDimmed = Array(gridSize * gridSize).fill(true);
         highlighted.forEach(h => nextDimmed[h] = false);

         setDimmed(nextDimmed);
      }

      const revealCascade = (...queue: number[]) => {
         let nextRevealed = revealed.slice()
         queue.forEach(cell => nextRevealed[cell] = true);

         while (queue.length > 0) {
            const center = queue.shift() as number;

            if (mines[center]) {
               nextRevealed[center] = true;

               const highlighted = getNeighbors(center).concat(center);

               let nextDimmed = Array(gridSize * gridSize).fill(true);
               highlighted.forEach(h => nextDimmed[h] = false);

               setDimmed(nextDimmed);
            }

            if (adjacent[center] === 0) {
               const unrevealed = getNeighbors(center).filter(n => !nextRevealed[n]);
               unrevealed.forEach(u => nextRevealed[u] = true);
               queue.push(...unrevealed);
            }
         }

         return nextRevealed;
      }

      const revealUnflaggedNeighbors = (cell: number) => {
         const neighbors = getNeighbors(cell);

         const adjacentFlags = neighbors.filter(n => flagged[n])
         if (adjacentFlags.length !== adjacent[cell]) return;

         const unflaggedNeighbors = neighbors.filter(n => !(revealed[n] || flagged[n]));

         setRevealed(revealCascade(...unflaggedNeighbors));
      }

      const revealCell = (cell: number) => {
         const nextRevealed = revealCascade(cell);
         const nextFlagged = flagged.slice();

         nextFlagged[cell] = false;

         setRevealed(nextRevealed);
         setFlagged(nextFlagged);
      }

      if (flagged[cell]) return;

      if (mines[cell]) {
         revealAllMines(cell);
      } else if (revealed[cell]) {
         revealUnflaggedNeighbors(cell);
      } else {
         revealCell(cell);
      }
   }, [mines, revealed, flagged, adjacent, getGameState, getNeighbors, populateBoard]);

   if (firstClick) {
      handleCellLeftClick(firstClick);
      setFirstClick(null);
   }

   const flagCell = (cell: number) => {
      let nextFlagged = flagged.slice();
      nextFlagged[cell] = !nextFlagged[cell];
      setFlagged(nextFlagged);
   }

   const handleCellRightClick = (event: React.MouseEvent, cell: number) => {
      event.preventDefault();
      if (getGameState() !== GameState.InProgress) return;

      flagCell(cell);
   };

   const handleCellMiddleOver = (cell: number) => {
      const highlighted = getNeighbors(cell).concat(cell);

      let nextDimmed = Array(gridSize * gridSize).fill(true);
      highlighted.forEach(h => nextDimmed[h] = false);

      setDimmed(nextDimmed);
   }

   const handleMiddleUp = () => {
      setDimmed(Array(gridSize * gridSize).fill(false));
   }

   return {
      gridSize,
      mineCount,
      setMineCount,
      board: { mines, revealed, flagged, adjacent, dimmed },
      resetBoard,
      handleCellLeftClick,
      handleCellRightClick,
      handleCellMiddleOver,
      handleMiddleUp,
      flagCell,
      getGameState,
   };
}
