import { arrayEquals } from "./util";

export enum GameState {
   InProgress,
   Won,
   Lost,
}

export class Game {
   gridSize: number;
   mineCount: number;

   mines: boolean[];
   revealed: boolean[];
   flagged: boolean[];
   adjacent: (number | null)[];

   constructor(gridSize: number = 9, mineCount: number = 10) {
      this.gridSize = gridSize;
      this.mineCount = mineCount;

      this.mines = [];
      this.adjacent = [];
      this.revealed = Array(this.gridSize * this.gridSize).fill(false);
      this.flagged = Array(this.gridSize * this.gridSize).fill(false);
   }

   revealCell(index: number) {
      if (this.getGameState() !== GameState.InProgress) return;
      if (this.flagged[index]) return;

      if (this.mines.length === 0) {
         this.populateBoard(index);
      }

      if (this.mines[index]) {
         this.revealed = this.revealed
            .zip(this.mines)
            .map(([revealed, mine]) => revealed || mine);

         // const highlighted = getNeighbors(newState.gridSize, cell).concat(cell);

         // newState.dimmed = Array(newState.gridSize * newState.gridSize).fill(true);
         // highlighted.forEach(h => newState.dimmed[h] = false);
      } else {
         this.revealCascade(index);
      }

      // newState.lastRevealed = cell;
   }

   revealNeighbors(index: number) {
      if (this.getGameState() !== GameState.InProgress) return;

      const neighbors = this.getNeighbors(index);
      const adjacentFlags = neighbors.filter(n => this.flagged[n])

      if (adjacentFlags.length !== this.adjacent[index]) return;

      const unflaggedNeighbors = neighbors.filter(n => !(this.revealed[n] || this.flagged[n]));

      this.revealCascade(...unflaggedNeighbors);
   }

   private revealCascade(...queue: number[]) {
      queue.forEach(index => this.revealed[index] = true);

      while (queue.length > 0) {
         const center = queue.shift() as number;

         if (this.mines[center]) {
            this.revealed[center] = true;

            // const highlighted = this.getNeighbors(center).concat(center);

            // newState.dimmed = Array(newState.gridSize * newState.gridSize).fill(true);
            // highlighted.forEach(h => newState.dimmed[h] = false);
         }

         if (this.adjacent[center] === 0) {
            const unrevealed = this.getNeighbors(center).filter(n => !this.revealed[n]);
            unrevealed.forEach(u => { this.revealed[u] = true; this.flagged[u] = false });
            queue.push(...unrevealed);
         }
      }
   }

   flagCell(index: number) {
      if (this.getGameState() !== GameState.InProgress) return;
      if (this.revealed[index]) return;

      this.flagged[index] = !this.flagged[index];
   }

   private populateBoard(firstClickedIndex: number) {
      this.mines = Array((this.gridSize * this.gridSize) - 1)
         .fill(true, 0, this.mineCount)
         .fill(false, this.mineCount)
         .shuffle();

      // make sure first clicked cell is never a mine
      this.mines.splice(firstClickedIndex, 0, false);

      this.adjacent = this.mines.withIndex().map(([index, mine]) =>
         mine
            ? null
            : this.getNeighbors(index).countBy((n) => this.mines[n])
      );
   }

   private getNeighbors(index: number): number[] {
      const gridSize = this.gridSize;

      const indexToCoords: (index: number) => [number, number] =
         index => [index % gridSize, Math.floor(index / gridSize)];

      const coordsToIndex: ([x, y]: [number, number]) => number =
         ([x, y]) => y * gridSize + x;

      const isInBounds = ([x, y]: [number, number]) =>
         x >= 0 && x < gridSize && y >= 0 && y < gridSize;

      const [x, y] = indexToCoords(index);
      const neighbors: [number, number][] = [
         [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
         [x - 1, y], /* ~center point~ */[x + 1, y],
         [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      ];

      return neighbors
         .filter(isInBounds)
         .map(coordsToIndex);
   }

   getGameState(): GameState {
      const emptyCells = this.mines.map(mine => !mine);
      if (arrayEquals(this.revealed, emptyCells)) {
         return GameState.Won;
      }

      const mineRevealed = this.revealed.zip(this.mines).some(([isRevealed, isMine]) => isRevealed && isMine)
      if (mineRevealed) {
         return GameState.Lost;
      }

      return GameState.InProgress;
   }

   // const highlightCells = (cell: number) => {
   //    const highlighted = getNeighbors(cell).concat(cell);

   //    let nextDimmed = Array(gridSize * gridSize).fill(true);
   //    highlighted.forEach(h => nextDimmed[h] = false);

   //    setDimmed(nextDimmed);
   // }

   // const unhighlightCells = () => {
   //    setDimmed(Array(gridSize * gridSize).fill(false));
   // }
}
