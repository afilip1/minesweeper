import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
   light: true,
   
   foreground: "black",
   background: "white",
   separator: "#eee",

   primary: "#ffaf2a",
   primaryDark: "#fd9f00",
   secondary: "#06a4ed",
   secondaryDark: "#149dd7",
   tertiary: "#3f3d40",
   tertiaryDark: "#2a2d32",

   themeToggle: "#ffaf2a",
   themeToggleIcon: "url('/img/sun.png')",
}

export const darkTheme: DefaultTheme = {
   ...lightTheme,
   
   light: false,

   foreground: "white",
   background: "black",
   separator: "#222",

   themeToggle: "#06a4ed",
   themeToggleIcon: "url('/img/moon.png')"
}