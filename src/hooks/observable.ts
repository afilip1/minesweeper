import { useState } from "react";

export function useObservable<T>(initState: T, onChange: (newValue: T) => void): [T, (newValue: T) => void] {
   const [value, setValue] = useState(initState);

   const setValueNotify = (newValue: T) => {
      setValue(newValue);
      onChange(newValue);
   }

   return [value, setValueNotify]
}