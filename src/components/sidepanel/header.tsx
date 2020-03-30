import React from "react";
import styled from "styled-components";
import { ThemeToggle } from "./themetoggle";

const Title = styled.h1`
   font-weight: 900;
   margin: 0;
   text-transform: uppercase;
`;

const StyledHeader = styled.header`
   margin-top: 25px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   grid-area: header;

`;

export function Header({ onThemeToggle }: { onThemeToggle: () => void }) {
   return (
      <StyledHeader>
         <div>
            <Title>Minekong</Title>
            <small>
               inspired by <a href="https://store.steampowered.com/app/265890/Hexcells/">Hexcells</a>
            </small>
         </div>

         <ThemeToggle onClick={onThemeToggle} />
      </StyledHeader>
   );
}