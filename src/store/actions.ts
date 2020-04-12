export type RevealCellAction = {
   type: string
   cellIndex: number
}

export function revealCell(cellIndex: number) {
   return {
      type: "REVEAL_CELL",
      cellIndex
   };
}

export type RevealNeighborsAction = {
   type: string
   cellIndex: number
}

export function revealNeighbors(cellIndex: number) {
   return {
      type: "REVEAL_NEIGHBORS",
      cellIndex
   };
}

export type FlagCellAction = {
   type: string
   cellIndex: number
}

export function flagCell(cellIndex: number) {
   return {
      type: "FLAG_CELL",
      cellIndex
   };
}

export type UpdateSettingsAction = {
   type: string
   gridSize: number
   mineCount: number
}

export function updateSettings(gridSize: number, mineCount: number) {
   return {
      type: "UPDATE_SETTINGS",
      gridSize,
      mineCount,
   };
}

export type Actions = RevealCellAction | FlagCellAction | UpdateSettingsAction;
