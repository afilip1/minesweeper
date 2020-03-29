import React from "react";
import { BoardState } from "src/hooks/game";
import { renderCell, CellHandlers } from "./cell";
import { range } from "src/util";
import styled from "styled-components";

const StyledBoard = styled.div`   
   height: 100vh;
   overflow: auto;
`;

const BoardGrid = styled.div<{ gridSize: number }>`
   --cell-size: 50px;

   display: grid;
   grid-template-columns: repeat(${props => props.gridSize}, var(--cell-size));
   grid-auto-rows: var(--cell-size);
   gap: 4px;

   padding: 25px;
`;

type BoardProps = {
   gridSize: number
   boardState: BoardState
} & CellHandlers

export function Board({ gridSize, boardState, ...handlers }: BoardProps) {
   const cellIds = range(0, boardState.revealed.length);
   const cells = cellIds.map(id => renderCell(id, boardState, handlers));

   return (
      <StyledBoard>
         <BoardGrid gridSize={gridSize}>
            {cells}
         </BoardGrid>
      </StyledBoard>
   );
}