import { createStore } from "redux";
import { Actions, RevealCellAction, RevealNeighborsAction, FlagCellAction, UpdateSettingsAction } from "./actions";

export enum GameState {
   InProgress,
   Won,
   Lost,
}

export type AppState = {
   gameState: GameState

   gridSize: number
   mineCount: number

   mines: boolean[]
   revealed: boolean[]
   flagged: boolean[]
   adjacent: (number | null)[]
   dimmed: boolean[]
   lastRevealed: number | null
}

function getInitialState(gridSize: number, mineCount: number): AppState {
   return {
      gameState: GameState.InProgress,

      gridSize,
      mineCount,

      mines: [],
      adjacent: [],
      revealed: Array(gridSize * gridSize).fill(false),
      flagged: Array(gridSize * gridSize).fill(false),
      dimmed: Array(gridSize * gridSize).fill(false),
      lastRevealed: null,
   }
};

function getNeighbors(gridSize: number, cellIndex: number): number[] {
   const indexToCoords: (index: number) => [number, number] =
      index => [index % gridSize, Math.floor(index / gridSize)];

   const coordsToIndex: ([x, y]: [number, number]) => number =
      ([x, y]) => y * gridSize + x;

   const isInBounds = ([x, y]: [number, number]) =>
      x >= 0 && x < gridSize && y >= 0 && y < gridSize;

   const [x, y] = indexToCoords(cellIndex);
   const neighbors: [number, number][] = [
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
      [x - 1, y], /* ~center point~ */[x + 1, y],
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
   ];

   return neighbors
      .filter(isInBounds)
      .map(coordsToIndex);
}

function getPopulatedBoard(gridSize: number, mineCount: number, firstClickedCellIndex: number) {
   const mines = Array((gridSize * gridSize) - 1)
      .fill(true, 0, mineCount)
      .fill(false, mineCount)
      .shuffle();

   // make sure first clicked cell is never a mine
   mines.splice(firstClickedCellIndex, 0, false);

   const adjacent = mines.withIndex().map(([cell, mine]) =>
      mine
         ? null
         : getNeighbors(gridSize, cell).countBy((n) => mines[n])
   );

   return { mines, adjacent };
}

function appReducer(state = getInitialState(9, 10), action: Actions): AppState {
   const revealCascade = (newState: AppState, queue: number[]) => {
      queue.forEach(cell => newState.revealed[cell] = true);

      while (queue.length > 0) {
         const center = queue.shift() as number;

         if (newState.mines[center]) {
            newState.revealed[center] = true;

            const highlighted = getNeighbors(newState.gridSize, center).concat(center);

            newState.dimmed = Array(newState.gridSize * newState.gridSize).fill(true);
            highlighted.forEach(h => newState.dimmed[h] = false);
         }

         if (newState.adjacent[center] === 0) {
            const unrevealed = getNeighbors(newState.gridSize, center).filter(n => !newState.revealed[n]);
            unrevealed.forEach(u => { newState.revealed[u] = true; newState.flagged[u] = false });
            queue.push(...unrevealed);
         }
      }
   }

   switch (action.type) {

      case "REVEAL_CELL": {
         if (state.gameState !== GameState.InProgress) return state;

         const revealAction = action as RevealCellAction;
         if (state.flagged[revealAction.cellIndex]) return state;

         let newState: AppState;
         if (state.mines.length === 0) {
            newState = { ...state, ...getPopulatedBoard(state.gridSize, state.mineCount, revealAction.cellIndex) };
         } else {
            newState = { ...state };
         }

         if (newState.mines[revealAction.cellIndex]) {
            newState.revealed = newState.revealed
               .zip(newState.mines)
               .map(([isRevealed, isMine]) => isRevealed || isMine);

            const highlighted = getNeighbors(newState.gridSize, revealAction.cellIndex).concat(revealAction.cellIndex);

            newState.dimmed = Array(newState.gridSize * newState.gridSize).fill(true);
            highlighted.forEach(h => newState.dimmed[h] = false);
         } else {
            revealCascade(newState, [revealAction.cellIndex]);
         }

         newState.lastRevealed = revealAction.cellIndex;

         const emptyCells = newState.mines.map(isMine => !isMine);

         if (newState.revealed.equals(emptyCells)) {
            newState.gameState = GameState.Won;
         } else {
            const mineRevealed = newState.revealed.zip(newState.mines).some(([isRevealed, isMine]) => isRevealed && isMine)
            if (mineRevealed) {
               newState.gameState = GameState.Lost;
            } else {
               newState.gameState = GameState.InProgress;
            }
         }

         return newState;
      }

      case "REVEAL_NEIGHBORS": {
         if (state.gameState !== GameState.InProgress) return state;

         const revealAction = action as RevealNeighborsAction;

         let newState = { ...state };
         const neighbors = getNeighbors(newState.gridSize, revealAction.cellIndex);

         const adjacentFlags = neighbors.filter(n => newState.flagged[n])
         if (adjacentFlags.length !== newState.adjacent[revealAction.cellIndex]) return newState;

         const unflaggedNeighbors = neighbors.filter(n => !(newState.revealed[n] || newState.flagged[n]));

         revealCascade(newState, unflaggedNeighbors);

         return newState;
      }

      case "FLAG_CELL": {
         if (state.gameState !== GameState.InProgress) return state;

         const flagAction = action as FlagCellAction;
         if (state.revealed[flagAction.cellIndex]) return state;

         let flagged = state.flagged.slice();
         flagged[flagAction.cellIndex] = !flagged[flagAction.cellIndex];

         return {
            ...state,
            flagged
         };
      }


      case "UPDATE_SETTINGS": {
         const updateAction = action as UpdateSettingsAction;

         return {
            ...state,
            ...getInitialState(updateAction.gridSize, updateAction.mineCount)
         };
      }
   }

   return state;
}

export const store = createStore(appReducer);

   // const highlightCells = (cell: number) => {
   //    const highlighted = getNeighbors(cell).concat(cell);

   //    let nextDimmed = Array(gridSize * gridSize).fill(true);
   //    highlighted.forEach(h => nextDimmed[h] = false);

   //    setDimmed(nextDimmed);
   // }

   // const unhighlightCells = () => {
   //    setDimmed(Array(gridSize * gridSize).fill(false));
   // }
