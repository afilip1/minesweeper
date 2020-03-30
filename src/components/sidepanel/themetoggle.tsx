import React from "react";
import styled from "styled-components";

export const ThemeToggle = styled.div.attrs({
   height: 20,
   children: <div />
})`
   width: ${props => props.height * 2}px;
   height: ${props => props.height}px;
   
   border-radius: ${props => props.height / 2}px;

   background-color: ${({ theme }) =>
      theme.light
         ? "var(--light-orange)"
         : "var(--light-blue)"
   };

   transition: color 0.3s ease;
   box-shadow: inset 0 3px 3px rgba(0,0,0,0.2);

   div {
      position: relative;

      width: ${props => props.height * 1.4}px;
      height: ${props => props.height * 1.4}px;

      top: ${props => -props.height / 5}px;
      left: ${props => props.theme.light
         ? (-props.height / 5)
         : (props.height - (props.height / 5))}px;
      
      background: ${({ theme }) => theme.light
         ? "url('/img/sun.png')"
         : "url('/img/moon.png')"
      };

      background-size: ${props => props.height * 1.4}px;

      transition: left 0.3s ease;
   }
`;