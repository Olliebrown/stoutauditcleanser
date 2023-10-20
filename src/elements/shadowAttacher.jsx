// React.js v18 basic includes
import React from 'react'
import { createRoot } from 'react-dom/client'

// MUI Emotion styles custom cache
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// MUI custom theme management
import { ThemeProvider } from '@mui/system'
import { createTheme } from '@mui/material/styles'

// Import custom CSS as a raw string (so we can attach to shadow DOM)
import CUSTOM_STYLES from './customCSS.txt'

import CleanserRoot from './Components/CleanserRoot.jsx'

// Some element ids for later lookup
export const EMOTION_ROOT_ID = 'reactEmotionRoot'
export const SHADOW_ROOT_ID = 'reactShadowDOMRoot'

// Main entry point for attaching the permission events and rendering the tour
export function attachReactDOM (rootRenderElement, componentParams) {
  // Sanitize the HTML elements
  rootRenderElement = rootRenderElement ?? document.getElementById('root')

  // Clean up some CSS in case this is an embedded tour
  rootRenderElement.scrollIntoView(true)

  // Attach using a shadow-dom to avoid style collisions
  let shadowContainer = rootRenderElement.shadowRoot
  if (!shadowContainer) {
    shadowContainer = rootRenderElement.attachShadow({ mode: 'open' })
  }

  // Build up the basic shadow DOM tree
  const emotionRoot = document.createElement('style')
  emotionRoot.id = EMOTION_ROOT_ID

  const customStyleRoot = document.createElement('style')
  customStyleRoot.appendChild(document.createTextNode(CUSTOM_STYLES))

  const shadowRootElement = document.createElement('div')
  shadowRootElement.id = SHADOW_ROOT_ID

  shadowContainer.appendChild(emotionRoot)
  shadowContainer.appendChild(customStyleRoot)
  shadowContainer.appendChild(shadowRootElement)

  // Make theme with proper portal root
  const shadowDOMTheme = createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowRootElement
        }
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootElement
        }
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootElement
        }
      }
    }
  })

  // Setup an emotion style cache
  const cache = createCache.default({ key: 'css', prepend: true, container: emotionRoot })

  // Render the root
  const reactRoot = createRoot(shadowRootElement)
  reactRoot.render(
    <CacheProvider value={cache}>
      <ThemeProvider theme={shadowDOMTheme}>
        <CleanserRoot />
      </ThemeProvider>
    </CacheProvider>
  )
}

// Export to main context for calling from HTML scripts
window.attachReactDOM = attachReactDOM
