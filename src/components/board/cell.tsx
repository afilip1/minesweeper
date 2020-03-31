import React from "react";
import { BoardState } from "src/hooks/game";
import { Clickable } from "../common/clickable";
import styled from "styled-components";

const StyledCellOuter = styled(Clickable)`
   border: 1px solid white;

   display: flex;
`;

const StyledCellInner = styled.div<{ dimmed: boolean, revealed: boolean, flagged: boolean }>`
   flex: 1;

   display: flex;
   align-items: center;
   justify-content: center;

   box-sizing: border-box;

   color: white;
   font-size: 1.15rem;
   font-weight: 900;
   
   background: ${({ theme }) => theme.primary};
   border: 5px solid ${({ theme }) => theme.primaryDark};

   ${props => props.dimmed && `
      filter: brightness(0.8) opacity(0.7) blur(1px) saturate(0.5);
      border: 1px solid darkgray;
   `}
   
   ${props => props.flagged && `  
      background: ${props.theme.secondary};
      border-color: ${props.theme.secondaryDark};
   `}

   ${props => props.revealed && `
      background: ${props.theme.tertiary};
      border-color: ${props.theme.tertiaryDark};
   `}
`;

export type CellHandlers = {
   onLeftClick: (i: number) => void
   onRightClick: (e: React.MouseEvent, i: number) => void
   onMiddleOver: (e: React.MouseEvent, i: number) => void
}

export function renderCell(id: number, board: BoardState, handlers: CellHandlers) {
   const revealed = board.revealed[id];
   const dimmed = board.dimmed[id];
   const flagged = board.flagged[id];
   const mine = board.mines[id];
   const adjacentCount = board.adjacent[id] as number;
   const isLastRevealed = board.lastRevealed === id;

   return (
      <StyledCellOuter
         key={id}
         onClick={() => handlers.onLeftClick(id)}
         onContextMenu={(e) => handlers.onRightClick(e, id)}
         onMouseDown={(e) => handlers.onMiddleOver(e, id)}
         onMouseEnter={(e) => handlers.onMiddleOver(e, id)}
      >
         <StyledCellInner
            dimmed={dimmed}
            revealed={revealed}
            flagged={flagged}
         >
            {revealed && (mine
               ? (isLastRevealed ? "💥" : "💣")
               : (adjacentCount > 0 && adjacentCount))}
         </StyledCellInner>
      </StyledCellOuter>
   );
}