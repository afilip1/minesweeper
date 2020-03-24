import React from "react";
import "./util"
import { Settings } from "./settings";
import { Board } from "./board";

export class Game extends React.Component {
   constructor(props) {
      super(props);

      const size = 9;
      const mineCount = 10;
      const totalCells = size * size;

      this.state = {
         size,
         mineCount,
         mines: [],
         revealed: Array(totalCells).fill(false),
         flagged: Array(totalCells).fill(false),
         adjacent: [],
      };

      this.handleClick = this.handleClick.bind(this);
      this.handleRightClick = this.handleRightClick.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   resetBoard() {
      const totalCells = this.state.size * this.state.size;

      this.setState({
         mines: [],
         revealed: Array(totalCells).fill(false),
         flagged: Array(totalCells).fill(false),
         adjacent: []
      });
   }

   initializeBoard(firstClickIndex) {
      const size = this.state.size;
      const mineCount = this.state.mineCount;

      const totalCells = size * size;

      const mines = Array(totalCells - 1).fill(true, 0, mineCount).fill(false, mineCount).shuffle();
      mines.splice(firstClickIndex, 0, false);
      const revealed = Array(totalCells).fill(false);
      const flagged = Array(totalCells).fill(false);
      const adjacent = this.countAdjacent(mines);

      this.setState({
         mines,
         revealed,
         flagged,
         adjacent
      }, () => this.handleClick(firstClickIndex));
   }

   countAdjacent(mines) {
      let adjacent = [];

      const size = this.state.size;

      for (let [index, isMine] of mines.entries()) {
         if (isMine) {
            adjacent.push(null);
            continue;
         }

         const [x, y] = this.indexToCoords(index, size);
         const neighbors = this.neighbors([x, y]);

         const adjacentCount =
            neighbors // filter out of bound values
               .map((coords) => this.coordsToIndex(coords, size))
               .map((index) => mines[index])
               .filter(Boolean)
               .length

         adjacent.push(adjacentCount);
      }

      return adjacent;
   }

   neighbors([x, y]) {
      const size = this.state.size;

      return [
         [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
         [x - 1, y], [x + 1, y],
         [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      ].filter(([x, y]) => x >= 0 && x < size && y >= 0 && y < size);
   }

   indexToCoords(index) {
      return [index % this.state.size, Math.floor(index / this.state.size)];
   }

   coordsToIndex([x, y]) {
      return y * this.state.size + x;
   }

   checkWinCondition() {
      const mines = this.state.mines;
      const revealed = this.state.revealed;
      const flagged = this.state.flagged;

      const revealedAllNonMines = revealed.equals(mines.map(x => !x));
      const flaggedAllMines = flagged.map((f, idx) => f && !revealed[idx]).equals(mines);

      if (revealedAllNonMines && flaggedAllMines) {
         return true;
      }

      // if a mine is revealed
      if (this.state.revealed.some((isRevealed, index) => isRevealed && this.state.mines[index])) {
         return false;
      }

      return null;
   }

   handleClick(i) {
      if (this.checkWinCondition() !== null) return;

      if (this.state.mines.length === 0) {
         this.initializeBoard(i);
         return;
      }

      let revealed;
      if (this.state.mines[i]) {
         // reveal mines while keeping previously revealed cells
         revealed = this.state.revealed.map((e, i) => e || this.state.mines[i]);
      } else {
         // empty cell
         revealed = this.state.revealed.slice();

         let clickedCellCoords = this.indexToCoords(i);
         let queue = [clickedCellCoords];

         while (queue.length > 0) {
            let centerCoords = queue.shift();
            revealed[this.coordsToIndex(centerCoords)] = true;

            let neighbors = this.neighbors(centerCoords);
            if (neighbors.every(n => this.state.mines[this.coordsToIndex(n)] === false)) {
               queue.push(...neighbors.filter(n => !revealed[this.coordsToIndex(n)]));
            }
         }
      }

      this.setState({ revealed });
   }

   handleRightClick(e, i) {
      e.preventDefault();
      if (this.checkWinCondition() !== null) return;

      let flagged = this.state.flagged.slice();
      flagged[i] = !flagged[i];
      this.setState({ flagged });
   }

   handleSubmit(size, mineCount) {
      this.setState({ size: size, mineCount: mineCount });
      this.resetBoard();
   }

   render() {
      const status = this.checkWinCondition();
      const { size, mines, flagged, revealed, adjacent } = this.state;


      return (
         <div>
            <Settings onSubmit={this.handleSubmit} />
            <h1>Status: {status ? "Won" : (status === null ? "Playing" : "Lost")}</h1>

            <Board
               size={size}
               mines={mines}
               flagged={flagged}
               revealed={revealed}
               adjacent={adjacent}
               onClick={this.handleClick}
               onRightClick={this.handleRightClick}
            />

            <button onClick={() => this.resetBoard()}>
               Restart
        </button>

         </div>
      );
   }
}