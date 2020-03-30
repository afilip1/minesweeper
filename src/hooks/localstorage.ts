import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initValue: T): [T, (value: T) => void] {
   let stored = localStorage.getItem(key);
   
   const [value, setValue] = useState(
      stored ? JSON.parse(stored) : initValue
   );
   
   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
   }, [key, value]);

   return [value, setValue];
}