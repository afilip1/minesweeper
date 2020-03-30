import 'styled-components'

declare module 'styled-components' {
   export interface DefaultTheme {
      light: boolean
      colors: {
         text: string
         background: string
         separator: string
      }
   }
}