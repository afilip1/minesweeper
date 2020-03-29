import React from "react";
import { Settings, SettingsProps } from "./settings";
import { StatusProps, Status } from "./status";
import { Info } from "./info";
import styled from "styled-components";
import { Header } from "./header";

const StyledSidePanel = styled.div`
   padding: 0 30px;
   border-right: 1px solid #eee;
   overflow-y: auto;
   height: 100vh;
`;

type SidePanelProps = SettingsProps & StatusProps

export function SidePanel({ gameState, minesLeft, ...controlPanelProps }: SidePanelProps) {
   return (
      <StyledSidePanel>
         <Header />

         <Status gameState={gameState} minesLeft={minesLeft} />

         <Settings {...controlPanelProps} />

         <Info />
      </StyledSidePanel>
   );
}
