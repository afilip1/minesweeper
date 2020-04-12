import React, { useState } from "react";
import { Cell } from "./cell";
import { range } from "src/util";
import styled from "styled-components";
import { ActionPill } from "./actionpill";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "src/store";
import { revealNeighbors, revealCell, flagCell } from "src/store/actions";

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


export function Board() {
   const [pillCell, setPillCell] = useState<number | null>(null);
   const openPill = (id: number) => setPillCell(id);
   const closePill = () => setPillCell(null);

   const dispatch = useDispatch();

   const boardState = useSelector((state: AppState) => state);

   const handleLeftClick = (i: number) => {
      if (boardState.revealed[i]) {
         dispatch(revealNeighbors(i));
      } else {
         dispatch(revealCell(i));
      }
   }

   const handleRightClick = (e: React.MouseEvent, i: number) => {
      e.preventDefault();
      dispatch(flagCell(i));
   }

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
                     handleLeftClick(id);
                     break;
                  case 2:
                     handleRightClick(e, id);
                     break;
               }
               break;
            case "touch":
               if (revealed && e.button === 0) {
                  handleLeftClick(id);
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
                  above={id > (boardState.gridSize - 1)}
                  onReveal={() => handleLeftClick(id)}
                  onFlag={(e) => handleRightClick(e, id)} />
            }
         </Cell>
      );
   });

   return (
      <>
         <StyledBoard>
            <div style={{ display: "inline-block" }}>
               <BoardGrid gridSize={boardState.gridSize}>
                  {cells}
               </BoardGrid>
            </div>
         </StyledBoard>
         <EdgeShadow />
      </>
   );
}