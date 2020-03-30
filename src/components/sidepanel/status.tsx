import React from "react";
import { GameState } from "src/hooks/game";
import styled from "styled-components";

const StyledStatus = styled.h2`
   grid-area: status;

   padding: 0 30px;
   margin-top: 10px;
`;

export type StatusProps = {
   gameState: GameState
   minesLeft: number
}

export function Status({ gameState, minesLeft }: StatusProps) {
   let status;
   switch (gameState) {
      case GameState.InProgress:
         status = "Flags left: " + minesLeft;
         break;
      case GameState.Won:
         status = "You won!"
         break;
      case GameState.Lost:
         status = "You lost :("
         break;
   }

   return <StyledStatus>{status}</StyledStatus>;
}
