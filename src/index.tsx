import React from "react";
import ReactDOM from "react-dom";
import "src/index.css";

import { CookiesProvider } from 'react-cookie';

import { Game } from "src/components/game";

function Root() {
   return (
      <CookiesProvider>
         <Game />
      </CookiesProvider>
   );
}

ReactDOM.render(
   <Root />,
   document.getElementById("root")
)