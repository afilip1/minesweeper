import { BoardState } from "src/hooks/game";
import React from "react";
import { SquareGrid } from "../common/squaregrid";
import { renderCell } from "./cell";
import { range } from "src/util";
import "./board.css";

type BoardProps = {
   gridSize: number
   boardState: BoardState,
   onLeftClick: (i: number) => void
   onRightClick: (e: React.MouseEvent, i: number) => void
   onMiddleOver: (e: React.MouseEvent, i: number) => void
}

export function Board({ gridSize, boardState, ...handlers }: BoardProps) {
   const cellIds = range(0, boardState.revealed.length);
   const cells = cellIds.map(id => renderCell(id, boardState, handlers));

   return (
      <div className="board">
         <SquareGrid size={gridSize} cellSize="50px">
            {cells}
         </SquareGrid>
      </div>
   );
}