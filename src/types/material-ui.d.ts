import { Theme } from "@material-ui/core/styles/createMuiTheme"

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: number
      appNavbarWidth: number
      maxContentWidth: number
      smd: number
    }
    colors: {
      transparent: string
      default: string
      reverse: string
      primary: string
      secondary: string
      third: string
      fourth: string
      fifth: string
      sixth: string
      seventh: string
      eighth: string
      boxShadow1: string
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: number
      appNavbarWidth: number
      maxContentWidth: number
      smd: number
    }
    colors: {
      transparent: string
      default: string
      reverse: string
      primary: string
      secondary: string
      third: string
      fourth: string
      fifth: string
      sixth: string
      seventh: string
      eighth: string
      boxShadow1: string
    }
  }
}
