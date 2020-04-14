import { createStore } from "redux";
import { Actions, RevealCellAction, RevealNeighborsAction, FlagCellAction, UpdateSettingsAction } from "./actions";
import { Game, GameState } from "src/game";

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

let board = new Game(9, 10);

function getState() {
   return {
      gameState: board.getGameState(),

      gridSize: board.gridSize,
      mineCount: board.mineCount,

      mines: board.mines,
      revealed: board.revealed,
      flagged: board.flagged,
      adjacent: board.adjacent,

      dimmed: [],
      lastRevealed: null
   };
}

function appReducer(state: AppState = getState(), action: Actions): AppState {
   switch (action.type) {
      case "REVEAL_CELL": {
         const { cell } = action as RevealCellAction;
         board.revealCell(cell);
         break;
      }

      case "REVEAL_NEIGHBORS": {
         const { cell } = action as RevealNeighborsAction;
         board.revealNeighbors(cell);
         break;
      }

      case "FLAG_CELL": {
         const { cell } = action as FlagCellAction;
         board.flagCell(cell);
         break;
      }

      case "UPDATE_SETTINGS": {
         const { gridSize, mineCount } = action as UpdateSettingsAction;
         board = new Game(gridSize, mineCount);
         break;
      }
   }

   return getState();
}

export const store = createStore(appReducer);
