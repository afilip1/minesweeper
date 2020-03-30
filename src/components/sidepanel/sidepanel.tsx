import React from "react";
import { Settings, SettingsProps } from "./settings/settings";
import { StatusProps, Status } from "./status";
import { Info } from "./info";
import styled from "styled-components";
import { Header } from "./header";

const StyledSidePanel = styled.div`
   padding: 0 30px;
   border-right: 1px solid ${props => props.theme.colors.separator};
   overflow-y: auto;

   height: 100vh;

   transition: border 0.3s linear;
`;

type SidePanelProps = { onToggleTheme: () => void } & SettingsProps & StatusProps

export function SidePanel({ onToggleTheme, gameState, minesLeft, ...controlPanelProps }: SidePanelProps) {
   return (
      <StyledSidePanel>
         <Header onThemeToggle={onToggleTheme} />
         <Status gameState={gameState} minesLeft={minesLeft} />

         <Settings {...controlPanelProps} />

         <Info />
      </StyledSidePanel>
   );
}
