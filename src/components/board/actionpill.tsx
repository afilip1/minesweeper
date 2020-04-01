import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

const ActionPillOuter = styled.div<{ above: boolean }>`
   position: absolute;

   display: flex;
   align-items: center;
   justify-content: center;

   width: 90px;
   height: 45px;

   ${props => props.above ? "bottom: 100%;" : "top: 100%;"}

   box-shadow: 3px 3px 3px rgba(0,0,0,0.2);

   border: 2px solid white;
   border-radius: 10px;

   z-index: 1;

   // arrow
   &::after {
      content: '';
      position: absolute;
      border-width: 7px;
      border-style: solid;
      
      ${props => props.above
      ? `top: 100%;
      border-color: white transparent transparent transparent;`
      : `bottom: 100%;
      border-color: transparent transparent white transparent;`
   }
   }

   *:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
   }

   *:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
   }
`;

const ActionButton = styled.div`
   flex: 1;
   background-color: ${props => props.color};
   height: 100%;
`;

type ActionPillProps = {
   above: boolean
   onReveal: () => void
   onFlag: (e: React.MouseEvent) => void
}

export const ActionPill = ({ above, onFlag, onReveal }: ActionPillProps) => {
   const theme = useContext(ThemeContext);

   return (
      <ActionPillOuter above={above}>
         <ActionButton onPointerUp={onFlag} color={theme.secondary} />
         <ActionButton onPointerUp={onReveal} color={theme.tertiary} />
      </ActionPillOuter>
   );
}
