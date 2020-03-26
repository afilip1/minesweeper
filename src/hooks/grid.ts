import { useCallback, useState } from "react";

export function useGrid(initSize: number) {
   const [gridSize, setGridSize] = useState(initSize);

   const getNeighbors: (cellIndex: number) => number[] =
      useCallback((cellIndex) => {
         const indexToCoords: (index: number) => [number, number] =
            index => [index % gridSize, Math.floor(index / gridSize)];

         const coordsToIndex: ([x, y]: [number, number]) => number =
            ([x, y]) => y * gridSize + x;

         const isInBounds = ([x, y]: [number, number]) =>
            x >= 0 && x < gridSize && y >= 0 && y < gridSize;

         const [x, y] = indexToCoords(cellIndex);
         const neighbors: [number, number][] = [
            [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y], /* ~center point~ */[x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
         ];

         return neighbors
            .filter(isInBounds)
            .map(coordsToIndex);
      }, [gridSize]);

   return {
      gridSize,
      setGridSize,
      getNeighbors
   };
}