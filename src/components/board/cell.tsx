import React from "react";
import styled from "styled-components";

const StyledCellOuter = styled.div`
   position: relative;

   display: flex;

   box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
   border: 1px solid white;
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

type CellProps = {
   dimmed: boolean
   revealed: boolean
   flagged: boolean

   onPointerUp: (e: React.PointerEvent) => void

   children: React.ReactNode
}

export function Cell({ dimmed, revealed, flagged, onPointerUp, children }: CellProps) {
   return (
      <StyledCellOuter
         onPointerUp={onPointerUp}
      >
         <StyledCellInner
            dimmed={dimmed}
            revealed={revealed}
            flagged={flagged}
         >
            {children}
         </StyledCellInner>
      </StyledCellOuter>
   );
}