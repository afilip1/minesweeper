import React, { useState, ReactNode } from "react";

type CollapsablePanelProps = {
   title: string
   collapsed?: boolean
   children: ReactNode
}

function CollapsiblePanel(props: CollapsablePanelProps) {
   const [collapsed, setCollapsed] = useState(props.collapsed ?? true);

   return (
      <div className="collapsible">
         <h2 style={{ display: "inline" }}>
            {props.title}
         </h2>

         <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "+" : "-"}
         </button>
         
         {!collapsed &&
            props.children}
      </div >
   );
}

export { CollapsiblePanel }