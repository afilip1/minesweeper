import React from "react";
import ReactDOM from "react-dom";
import "src/index.css";

import { Game } from "src/components/game";

function Root() {
   return <Game />;
}

ReactDOM.render(
   <Root />,
   document.getElementById("root")
)