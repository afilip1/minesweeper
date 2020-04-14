export type RevealCellAction = {
   type: string
   cell: number
}

export function revealCell(cell: number) {
   return {
      type: "REVEAL_CELL",
      cell
   };
}

export type RevealNeighborsAction = {
   type: string
   cell: number
}

export function revealNeighbors(cell: number) {
   return {
      type: "REVEAL_NEIGHBORS",
      cell
   };
}

export type FlagCellAction = {
   type: string
   cell: number
}

export function flagCell(cell: number) {
   return {
      type: "FLAG_CELL",
      cell
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
