import { useCallback, useState } from "react";

export function useGrid(initSize) {
   const [gridSize, setGridSize] = useState(initSize);

   const indexToCoords = useCallback((index) => {
      return [index % gridSize, Math.floor(index / gridSize)]
   }, [gridSize]);

   const coordsToIndex = useCallback(([x, y]) => {
      return y * gridSize + x
   }, [gridSize]);

   const getNeighbors = useCallback(([x, y]) => {
      const isInBounds = ([x, y]) => x >= 0 && x < gridSize && y >= 0 && y < gridSize;

      const neighbors = [
         [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
         [x - 1, y], /* ~center point~ */[x + 1, y],
         [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      ];

      return neighbors.filter(isInBounds);
   }, [gridSize]);

   return {
      gridSize,
      setGridSize,
      indexToCoords,
      coordsToIndex,
      getNeighbors
   };
}