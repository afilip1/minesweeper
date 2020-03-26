import { useState, SyntheticEvent, useCallback } from "react";
import { useGrid } from "src/hooks/grid"

export type BoardState = {
   mines: boolean[],
   revealed: boolean[],
   flagged: boolean[],
   adjacent: (number | null)[]
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

   const getInitState = (size: number) => ({
      mines: [],
      revealed: Array(size * size).fill(false),
      flagged: Array(size * size).fill(false),
      adjacent: []
   }) as BoardState;

   const [board, setBoard] = useState(getInitState(gridSize));
   const resetBoard = (size: number, mineCount: number) => {
      setGridSize(size);
      setMineCount(mineCount);
      setBoard(getInitState(size));
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

      setBoard({ ...board, mines, adjacent });
   }, [board, gridSize, mineCount, getNeighbors]);

   const getGameState = useCallback(() => {
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
   }, [board]);

   const handleCellClick = useCallback((cell: number) => {
      if (getGameState() !== GameState.InProgress) return;

      if (board.mines.length === 0) {
         populateBoard(cell);
         setFirstClick(cell);
         return;
      }

      const revealAllMines = () => {
         const revealed = board.revealed
            .zip(board.mines)
            .map(([isRevealed, isMine]) => isRevealed || isMine);

         setBoard({ ...board, revealed });
      }

      const revealCascade = (...queue: number[]) => {
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

      const revealUnflaggedNeighbors = (cell: number) => {
         const neighbors = getNeighbors(cell);

         const adjacentFlags = neighbors.filter(n => board.flagged[n])
         if (adjacentFlags.length !== board.adjacent[cell]) return;

         const unflaggedNeighbors = neighbors.filter(n => !(board.revealed[n] || board.flagged[n]));

         setBoard(revealCascade(...unflaggedNeighbors));
      }

      const revealCell = (cell: number) => {
         let nextBoard = revealCascade(cell);
         nextBoard.flagged[cell] = false;
         setBoard(nextBoard);
      }

      if (board.flagged[cell]) return;

      if (board.mines[cell]) {
         revealAllMines();
      } else if (board.revealed[cell]) {
         revealUnflaggedNeighbors(cell);
      } else {
         revealCell(cell);
      }
   }, [board, getGameState, getNeighbors, populateBoard]);

   if (firstClick) {
      handleCellClick(firstClick);
      setFirstClick(null);
   }

   const flagCell = (cell: number) => {
      let flagged = board.flagged.slice();
      flagged[cell] = !flagged[cell];
      setBoard({ ...board, flagged });
   }

   const handleCellRightClick = (event: SyntheticEvent, cell: number) => {
      event.preventDefault();
      if (getGameState() !== GameState.InProgress) return;

      flagCell(cell);
   };

   return {
      gridSize,
      mineCount,
      setMineCount,
      board,
      resetBoard,
      handleCellClick,
      handleCellRightClick,
      flagCell,
      getGameState,
   };
}
