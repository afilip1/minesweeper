import 'styled-components'
import { lightTheme } from "./theme";

declare module 'styled-components' {
   const Theme = typeof lightTheme;
   export interface DefaultTheme extends Theme { }
}