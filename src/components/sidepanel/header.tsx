import React from "react";
import styled from "styled-components";

const Title = styled.h1`
   font-weight: 900;
   margin-top: 25px;
   margin-bottom: 0;
   text-transform: uppercase;
`;

export function Header() {
   return (
      <header>
         <Title>Minekong</Title>
         <small>
            inspired by <a href="https://store.steampowered.com/app/265890/Hexcells/">Hexcells</a>
         </small>
      </header>
   );
}