import React from "react";
import { BoardState } from "src/hooks/game";
import { renderCell, CellHandlers } from "./cell";
import { range } from "src/util";
import styled from "styled-components";

const StyledBoard = styled.div`
   grid-area: board;
   
   overflow: auto;
   padding: 10px 30px;

   overscroll-behavior: none;

   @media screen and (min-width: 768px) {
      padding: 30px;

      border-left: 1px solid ${({theme}) => theme.separator};
      transition: border 0.3s linear;
   }
`;

const BoardGrid = styled.div<{ gridSize: number }>`
   --cell-size: 40px;

   display: grid;
   grid-template-columns: repeat(${props => props.gridSize}, var(--cell-size));
   grid-auto-rows: var(--cell-size);
   gap: 4px;
`;

const Shadow = styled.div`
   position: relative;
   grid-area: board;
   content: '';
   height: 330px;

   @media screen and (min-width: 768px) {
      display: none;
   }

   box-shadow: inset 0 0 5px ${({theme}) => theme.background};
   pointer-events: none;

   transition: box-shadow 0.3s linear;
`;

type BoardProps = {
   gridSize: number
   boardState: BoardState
} & CellHandlers

export function Board({ gridSize, boardState, ...handlers }: BoardProps) {
   const cellIds = range(0, boardState.revealed.length);
   const cells = cellIds.map(id => renderCell(id, boardState, handlers));

   return (
      <>
         <StyledBoard>
            <div style={{ display: "inline-block" }}>
               <BoardGrid gridSize={gridSize}>
                  {cells}
               </BoardGrid>
            </div>
         </StyledBoard>
         <Shadow />
      </>
   );
}