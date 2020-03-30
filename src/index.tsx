import React from "react";
import ReactDOM from "react-dom";
import "src/index.css";

import { App } from "src/components/app";

function Root() {
   return <App />;
}

ReactDOM.render(
   <Root />,
   document.getElementById("root")
)