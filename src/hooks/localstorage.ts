import { useState, useEffect } from "react";

function useLocalStorage(key: string, initValue: string = ""): [string, (value: string) => void] {
   const [value, setValue] = useState(
      localStorage.getItem(key) ?? initValue
   );

   useEffect(() => {
      localStorage.setItem(key, value);
   }, [key, value]);

   return [value, setValue];
}

function useLocalStorageNumber(key: string, initValue: number = 0): [number, (value: number) => void] {
   const [strValue, setStrValue] = useLocalStorage(key, initValue.toString());

   const value = +strValue;
   const setValue = (newValue: number) => setStrValue(newValue.toString());

   return [value, setValue];
}

export { useLocalStorage, useLocalStorageNumber };