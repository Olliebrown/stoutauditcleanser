import { applyStyle } from './summarizeButton.js'

const ROOT_DIV_STYLE = {
  position: 'fixed',
  top: '100px',
  right: '200px'
}

function makeFontCSSTag (href) {
  const fontTag = document.createElement('link')
  fontTag.setAttribute('rel', 'stylesheet')
  fontTag.setAttribute('href', href)
  return fontTag
}

export function makeCleanserContainer () {
  const rootDiv = document.createElement('div')
  applyStyle(rootDiv, ROOT_DIV_STYLE)
  return rootDiv
}

export function makeRobotoFontTag () {
  return makeFontCSSTag(
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
  )
}

export function makeIconsFontTag () {
  return makeFontCSSTag(
    'https://fonts.googleapis.com/icon?family=Material+Icons'
  )
}
