import React, { useState, FormEvent } from "react";
import { GameState } from "src/hooks/game"
import { CollapsiblePanel } from "./collapsiblepanel";

type GameStatusProps = {
   gameState: GameState,
   minesLeft: number,
}

function GameStatus({ gameState, minesLeft }: GameStatusProps) {
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

type ControlPanelProps = {
   gridSize: number,
   mineCount: number,
   onSettingsUpdate: (gridSize: number, mineCount: number) => void
} & GameStatusProps;

export function ControlPanel(props: ControlPanelProps) {
   const [gridSize, setGridSize] = useState(props.gridSize);
   const [mineCount, setMineCount] = useState(props.mineCount);
   const [settingsChanged, setSettingsChanged] = useState(false);

   const handleGridSizeChange = (event: FormEvent<HTMLInputElement>) => {
      setGridSize(+event.currentTarget.value);
      setSettingsChanged(true);
   };

   const handleMineCountChange = (event: FormEvent<HTMLInputElement>) => {
      setMineCount(+event.currentTarget.value);
      setSettingsChanged(true);
   }

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      props.onSettingsUpdate(gridSize, mineCount);
      setSettingsChanged(false);
   }

   return (
      <div className="control-panel">
         <h1>MINEKONG</h1>

         <GameStatus gameState={props.gameState} minesLeft={props.minesLeft} />

         <form onSubmit={handleSubmit} autoComplete="off">
            <label>
               Grid size
               <input name="gridSize" type="text" value={gridSize} onChange={handleGridSizeChange} />
            </label>

            <label>
               Mine count
               <input name="mineCount" type="text" value={mineCount} onChange={handleMineCountChange} />
            </label>
            <button type="submit">{settingsChanged ? "Apply and restart" : "Restart"}</button>
         </form>

         <CollapsiblePanel title="Rules">
            <p>The board contains a number of cells. Each cell can be either empty or a mine.</p>
            <p>The goal of the game is to flag all the mines and reveal all the empty cells.</p>
            <p>If you reveal a mine, it's game over!</p>
            <p>Empty cells show a number of mines that reside in the 8 adjacent cells.</p>
         </CollapsiblePanel>

         <CollapsiblePanel title="Controls">
            <p><strong>Left click</strong> on an unrevealed cell to reveal it.</p>
            <p><strong>Right click</strong> on an unrevealed cell to flag it as a mine.</p>
            <p><strong>Hold middle mouse button</strong> over an revealed cell to highlight its neighbors.</p>

            <p><strong>Tip #1:</strong> If you've placed enough flags near a revealed cell, you can left click on it to automatically reveal cells without flags.</p>
            <p><strong>Tip #2:</strong> The first cell you click will never be a mine, so don't worry about where to click.</p>
         </CollapsiblePanel>
      </div>
   );
}