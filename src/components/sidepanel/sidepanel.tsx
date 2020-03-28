import React from "react";
import { ControlPanel, ControlPanelProps } from "./controlpanel";
import { StatusProps, Status } from "./status";
import { Info } from "./info";
import "./sidepanel.css";

type SidePanelProps = ControlPanelProps & StatusProps

export function SidePanel({ gameState, minesLeft, ...controlPanelProps }: SidePanelProps) {
   return (
      <div className="side-panel">
         <h1>Minekong</h1>
         <small>
            inspired by <a href="https://store.steampowered.com/app/265890/Hexcells/">Hexcells</a>
         </small>

         <Status gameState={gameState} minesLeft={minesLeft} />

         <ControlPanel {...controlPanelProps} />

         <Info />
      </div>
   );
}
