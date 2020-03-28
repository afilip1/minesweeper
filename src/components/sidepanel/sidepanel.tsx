import React from "react";
import { Settings, SettingsProps } from "./settings";
import { StatusProps, Status } from "./status";
import { Info } from "./info";
import "./sidepanel.css";

type ControlPanelProps = SettingsProps & StatusProps

export function SidePanel({ gameState, minesLeft, ...settingsProps }: ControlPanelProps) {
   return (
      <div className="side-panel">
         <h1>MINEKONG</h1>
         <small>inspired by <a href="https://store.steampowered.com/app/265890/Hexcells/">Hexcells</a></small>

         <Status gameState={gameState} minesLeft={minesLeft} />

         <Settings {...settingsProps} />

         <Info />
      </div>
   );
}
