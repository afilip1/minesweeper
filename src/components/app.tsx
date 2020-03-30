import React from "react";
import "src/util";
import { useGame } from "src/hooks/game";
import { Board } from "./board/board";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "src/theme";
import { useLocalStorage } from "src/hooks/localstorage";
import { Header } from "./sidepanel/header";
import { Status } from "./sidepanel/status";
import { Settings } from "./sidepanel/settings/settings";
import { Info } from "./sidepanel/info";

const GlobalStyle = createGlobalStyle`      
   html, body {
      margin: 0;
      user-select: none;
   }
      
   ::-moz-focus-inner {
      border: 0;
   }
`;

const StyledApp = styled.div`
   --light-blue: #06a4ed;
   --dark-blue: #149dd7;
   --light-orange: #ffaf2a;
   --dark-orange: #fd9f00;
   --light-gray: #3f3d40;
   --dark-gray: #2a2d32;

   height: 100vh;
   
   overflow: auto;
   display: grid;

   grid-template-rows: 90px 330px 40px 210px 70px;

   grid-template-areas:
      "header"
      "board"
      "status"
      "settings"
      "info";

   @media screen and (min-width: 768px) {
      grid-template-columns: 360px auto;
      grid-template-rows: 100px 80px 230px auto;

      grid-template-areas:
         "header   board"
         "status   board"
         "settings board"
         "info     board";
   }

   color: ${props => props.theme.colors.text};
   background-color: ${props => props.theme.colors.background};

   transition: color 0.3s linear,
               background-color 0.3s linear;
      
   * {
      font-family: 'Montserrat', sans-serif;
   }

   a {
      color: ${props => props.theme.colors.text};
      transition: color 0.3s linear;
   }
   
   input {
      color: ${props => props.theme.colors.text};
      background-color: ${props => props.theme.colors.background};

      transition: color 0.3s linear,
                  background-color 0.3s linear;
   }
`;

export function App() {
   const {
      gridSize,
      mineCount,
      board,
      resetBoard,
      tryRevealCell,
      tryRevealUnflaggedNeighbors,
      tryFlagCell,
      highlightCells,
      unhighlightCells,
      getGameState,
   } = useGame({ initSize: 9, initMineCount: 10 });

   const handleSettingsUpdate = (newGridSize: number, newMineCount: number) => {
      resetBoard(newGridSize, newMineCount);
   }

   const handleMouseUp = (e: React.MouseEvent) => {
      if (e.button === 1) {
         unhighlightCells();
      }
   }

   const handleMiddleOver = (e: React.MouseEvent, i: number) => {
      if (e.buttons === 4) {
         highlightCells(i);
      }
   }

   const handleRightClick = (e: React.MouseEvent, i: number) => {
      e.preventDefault();
      tryFlagCell(i);
   }

   const handleLeftClick = (i: number) => {
      if (board.revealed[i]) {
         tryRevealUnflaggedNeighbors(i);
      } else {
         tryRevealCell(i);
      }
   }

   const preventScrolling = (e: React.MouseEvent) => {
      if (e.buttons === 4) {
         e.preventDefault();
      }
   }

   const [useDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', false);
   const toggleDarkTheme = () => setDarkTheme(!useDarkTheme);

   const theme = useDarkTheme ? darkTheme : lightTheme;

   return (
      <ThemeProvider theme={theme}>
         <GlobalStyle theme={theme} />
         <StyledApp onContextMenu={(e) => e.preventDefault()} onMouseUp={handleMouseUp} onMouseDown={preventScrolling}>
            <Header onThemeToggle={toggleDarkTheme} />

            <Status gameState={getGameState()} minesLeft={mineCount - board.flagged.countBy(Boolean)} />

            <Settings gridSize={gridSize} mineCount={mineCount} onSettingsUpdate={handleSettingsUpdate} />

            <Info />

            <Board
               gridSize={gridSize}
               boardState={board}
               onLeftClick={handleLeftClick}
               onRightClick={handleRightClick}
               onMiddleOver={handleMiddleOver}
            />
         </StyledApp>
      </ThemeProvider>
   );
}
