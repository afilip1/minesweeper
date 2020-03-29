import React, { ReactNode } from "react";
import styles from "./squaregrid.module.css";

type SquareGridProps = { size: number, cellSize?: string, children: ReactNode };

export function SquareGrid({ size, cellSize = "1fr", children }: SquareGridProps) {
   const gridStyle = {
      gridTemplateColumns: `repeat(${size}, ${cellSize})`,
      gridAutoRows: cellSize
   };

   return (
      <div className={styles.grid} style={gridStyle}>
         {React.Children.map(children, (child) =>
            <div className={styles["grid-item"]}>{child}</div>
         )}
      </div>
   );
}