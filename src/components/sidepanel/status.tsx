import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { AppState, GameState } from "src/store";

const StyledStatus = styled.h2`
   grid-area: status;

   padding: 0 30px;
   margin-top: 10px;
`;

export type StatusProps = {
   gameState: GameState
   minesLeft: number
}

export function Status() {
   const gameState = useSelector((state: AppState) => state.gameState);
   const minesLeft = useSelector((state: AppState) => state.mineCount - state.flagged.countBy(Boolean));

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
