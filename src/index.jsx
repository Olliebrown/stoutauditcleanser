// React root rendering support
import React from 'react'
import { createRoot } from 'react-dom/client'

// Root component
import AppRoot from './elements/AppRoot.jsx'

// Build a CSS tag for font loading
function makeFontCSSTag (href) {
  const fontTag = document.createElement('link')
  fontTag.setAttribute('rel', 'stylesheet')
  fontTag.setAttribute('href', href)
  return fontTag
}

function makeFontTags () {
  return [
    makeFontCSSTag('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'),
    makeFontCSSTag('https://fonts.googleapis.com/icon?family=Material+Icons')
  ]
}

// Add Font loading tag
const fontTags = makeFontTags()
fontTags.forEach(tag => document.head.appendChild(tag))

// Create new container for the React app
const appContainer = document.createElement('div')
appContainer.id = 'cleanser-app-container'
document.body.appendChild(appContainer)

// Add the main react app
const reactAppRoot = createRoot(appContainer)
reactAppRoot.render(<AppRoot />)
