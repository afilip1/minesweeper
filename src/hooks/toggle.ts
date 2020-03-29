import React from "react"

export function useToggle(initState: boolean): [boolean, () => void, (value: boolean) => void] {
   const [value, setValue] = React.useState(initState);
   const toggle = () => setValue(!value);

   return [value, toggle, setValue];
}