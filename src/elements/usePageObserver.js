import React from 'react'
import { QUERIES } from '../domTraversal/queriesAndRegex.js'

// How long to wait between checks for the page div (in ms)
const PAGE_DIV_CHECK_WAIT_TIME = 200

// Observe the central iFrame for page changes
export function usePageObserver () {
  // pageId = the ID of the page we are on (if any)
  const [pageId, setPageId] = React.useState('')

  // Reference to the iFrame (set once on load)
  const [iframeRef, setIframeRef] = React.useState(null)
  React.useEffect(() => {
    const iframe = document.querySelector('iframe')
    setIframeRef(iframe)
  }, [])

  // Disable the show button if we are not on the audit page
  const checkPage = React.useCallback(() => {
    // Update page Id
    const targetElement = iframeRef?.contentDocument?.getElementById(QUERIES.pageDivId)
    if (targetElement) {
      const pageVal = targetElement.getAttribute('page')
      if (pageVal !== pageId) {
        // console.log(`Page id changed to ${pageVal}`)
        setPageId(pageVal)
      }
    } else {
      console.log('Page id not found')
      setPageId('')
    }
  }, [iframeRef?.contentDocument, pageId])

  // Observe loading events for the iFrame
  // NOTE: This does NOT catch all page changes
  React.useEffect(() => {
    if (!iframeRef) { return }
    iframeRef.addEventListener('load', checkPage)
    return () => { iframeRef.removeEventListener('load', checkPage) }
  }, [checkPage, iframeRef])

  // Observe the iFrame body for changes
  // NOTE: This catches other page changes that don't reload the iFrame
  React.useEffect(() => {
    if (!iframeRef) { return }

    // Create mutation observer to detect when the iframe page changes
    const observer = new MutationObserver(() => { checkPage() })

    // Function to find the page div and start observing it
    const findPageDiv = () => {
      const targetNode = iframeRef?.contentDocument?.getElementById(QUERIES.pageDivId)
      if (targetNode) {
        observer.observe(iframeRef.contentDocument?.body, { attributes: true })
      } else {
        setTimeout(findPageDiv, PAGE_DIV_CHECK_WAIT_TIME)
      }
    }

    // Start and keep trying to connect to the page div
    // (in case it is not loaded yet)
    setTimeout(findPageDiv, PAGE_DIV_CHECK_WAIT_TIME)

    // Disconnect before reconnecting the observer
    return () => { observer.disconnect() }
  }, [checkPage, iframeRef, iframeRef?.contentDocument?.body])

  // Return back the pageId
  return pageId
}
