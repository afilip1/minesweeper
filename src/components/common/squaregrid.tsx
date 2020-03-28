import React, { ReactNode } from "react";

type SquareGridProps = { size: number, cellSize: string, children: ReactNode };

export function SquareGrid({ size, cellSize, children }: SquareGridProps) {
   const gridStyle = {
      gridTemplateColumns: `repeat(${size}, ${cellSize})`,
      gridAutoRows: cellSize
   };

   return (
      <div className="board-grid" style={gridStyle}>
         {children}
      </div>
   );
}