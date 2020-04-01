import React, { useState } from "react";
import { BoardState } from "src/hooks/game";
import { Cell, CellHandlers } from "./cell";
import { range } from "src/util";
import styled from "styled-components";
import { ActionPill } from "./actionpill";

const StyledBoard = styled.div`
   grid-area: board;
   
   overflow: auto;
   overscroll-behavior: none;

   z-index: 1;

   @media screen and (min-width: 768px) {
      border-left: 1px solid ${({ theme }) => theme.separator};
      transition: border 0.3s linear;
   }
`;

const BoardGrid = styled.div<{ gridSize: number }>`
   --cell-size: 40px;

   margin: 10px 30px;

   @media screen and (min-width: 768px) {
      margin: 30px;
   }

   display: grid;
   grid-template-columns: repeat(${props => props.gridSize}, var(--cell-size));
   grid-auto-rows: var(--cell-size);
   gap: 4px;
`;

const EdgeShadow = styled.div`
   position: relative;
   grid-area: board;

   @media screen and (min-width: 768px) {
      display: none;
   }

   box-shadow: inset 0 0 5px ${({ theme }) => theme.background};
   pointer-events: none;

   transition: box-shadow 0.3s linear;
   z-index: 2;
`;

type BoardProps = {
   gridSize: number
   boardState: BoardState
} & CellHandlers

export function Board({ gridSize, boardState, ...handlers }: BoardProps) {
   const [pillCell, setPillCell] = useState<number | null>(null);
   const openPill = (id: number) => setPillCell(id);
   const closePill = () => setPillCell(null);

   const cellIds = range(0, boardState.revealed.length);
   const cells = cellIds.map(id => {
      const isPillOpen = pillCell === id;
      const revealed = boardState.revealed[id];
      const dimmed = boardState.dimmed[id];
      const flagged = boardState.flagged[id];
      const mine = boardState.mines[id];
      const adjacentCount = boardState.adjacent[id] as number;
      const isLastRevealed = boardState.lastRevealed === id;

      const handlePointerUp = (e: React.PointerEvent) => {
         switch (e.pointerType) {
            case "mouse":
               switch (e.button) {
                  case 0:
                     handlers.onLeftClick(id);
                     break;
                  case 2:
                     handlers.onRightClick(e, id);
                     break;
               }
               break;
            case "touch":
               if (revealed && e.button === 0) {
                  handlers.onLeftClick(id);
                  closePill();
               } else {
                  isPillOpen ? closePill() : openPill(id);
               }
               break;
         }
      }

      return (
         <Cell
            key={id}
            {...{ dimmed, flagged, revealed, mine, adjacentCount, isLastRevealed }}
            onPointerUp={handlePointerUp}
         >
            {revealed && (mine
               ? (isLastRevealed ? "💥" : "💣")
               : (adjacentCount > 0 && adjacentCount))}

            {isPillOpen &&
               <ActionPill
                  above={id > (gridSize - 1)}
                  onReveal={() => handlers.onLeftClick(id)}
                  onFlag={(e) => handlers.onRightClick(e, id)} />
            }
         </Cell>
      );
   });

   return (
      <>
         <StyledBoard>
            <div style={{ display: "inline-block" }}>
               <BoardGrid gridSize={gridSize}>
                  {cells}
               </BoardGrid>
            </div>
         </StyledBoard>
         <EdgeShadow />
      </>
   );
}