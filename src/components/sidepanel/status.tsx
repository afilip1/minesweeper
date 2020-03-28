import React from "react";
import { GameState } from "src/hooks/game";

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

   return <h2>{status}</h2>;
}
