import styled from "styled-components";

export const Clickable = styled.div`
   box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
   
   transition: filter 0.5s ease;

   &:active {
      transition: filter 0s;
      filter: opacity(0.8) contrast(1.2);
   }
`;