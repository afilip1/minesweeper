import React from "react";
import { CollapsiblePanel } from "../common/collapsiblepanel";

export function Info() {
   return (
      <>
         <CollapsiblePanel title="Rules">
            <p>The board contains a number of cells. Each cell can be either empty or a mine.</p>
            <p>The goal of the game is to flag all the mines and reveal all the empty cells.</p>
            <p>If you reveal a mine, it's game over!</p>
            <p>Empty cells show the number of mines that reside in the 8 adjacent cells.</p>
         </CollapsiblePanel>

         <CollapsiblePanel title="Controls">
            <p><strong>Left click</strong> on an unrevealed cell to reveal it.</p>
            <p><strong>Right click</strong> on an unrevealed cell to flag it as a mine.</p>
            <p><strong>Hold middle mouse button</strong> over an revealed cell to highlight its neighbors.</p>

            <p><strong>Tip #1:</strong> If you've placed enough flags near a revealed cell, you can left click on it to automatically reveal cells without flags.</p>
            <p><strong>Tip #2:</strong> The first cell you click will never be a mine, so don't worry about where to click.</p>
         </CollapsiblePanel>
      </>
   );
}