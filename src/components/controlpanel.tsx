import React, { useState, FormEvent } from "react";
import { GameState } from "src/hooks/game"

type GameStatusProps = {
   gameState: GameState,
   minesLeft: number,
}

function GameStatus({ gameState, minesLeft }: GameStatusProps) {
   let status;
   switch (gameState) {
      case GameState.InProgress:
         status = "Mines remaining: " + minesLeft;
         break;
      case GameState.Won:
         status = "You win!"
         break;
      case GameState.Lost:
         status = "You lose :("
         break;
   }

   return <h1>{status}</h1>
}

type SettingsProps = {
   gridSize: number,
   mineCount: number,
   onSettingsUpdate: (gridSize: number, mineCount: number) => void
   onRestart: () => void
} & GameStatusProps;

export function ControlPanel(props: SettingsProps) {
   const [gridSize, setGridSize] = useState(props.gridSize);
   const [mineCount, setMineCount] = useState(props.mineCount);

   const handleGridSizeChange = (event: FormEvent<HTMLInputElement>) => {
      setGridSize(+event.currentTarget.value);
   };

   const handleMineCountChange = (event: FormEvent<HTMLInputElement>) => {
      setMineCount(+event.currentTarget.value);
   }

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.onSettingsUpdate(gridSize, mineCount);
   }

   return (
      <div>
         <form onSubmit={handleSubmit}>
            <label>
               Grid size:
            <input name="gridSize" type="text" value={gridSize} onChange={handleGridSizeChange} />
            </label>
            <label>
               Mine count:
            <input name="mineCount" type="text" value={mineCount} onChange={handleMineCountChange} />
            </label>
            <button type="submit">Apply</button>
         </form>

         <button onClick={props.onRestart}>Restart</button>

         <GameStatus gameState={props.gameState} minesLeft={props.minesLeft} />
      </div>
   );
}