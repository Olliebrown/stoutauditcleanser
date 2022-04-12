function makeFontCSSTag (href) {
  const fontTag = document.createElement('link')
  fontTag.setAttribute('rel', 'stylesheet')
  fontTag.setAttribute('href', href)
  return fontTag
}

export function makeCleanserContainer () {

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
