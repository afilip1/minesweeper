import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
   light: true,
   colors: {
      text: "black",
      background: "white",
      separator: "#eee",
   }
}

export const darkTheme: DefaultTheme = {
   light: false,
   colors: {
      text: "white",
      background: "black",
      separator: "#222",
   }
}