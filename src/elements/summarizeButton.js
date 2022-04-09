const BUTTON_STYLE = {
  backgroundColor: '#31B0D5',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '4px',
  borderColor: '#46b8da'
}

const BUTTON_DIV_STYLE = {
  position: 'fixed',
  bottom: '-4px',
  right: '20px'
}

export function makeSummarizeButton (clickCallback) {
  const summarizeButton = document.createElement('button')
  summarizeButton.appendChild(document.createTextNode('Summarize'))
  summarizeButton.addEventListener('click', clickCallback)
  applyStyle(summarizeButton, BUTTON_STYLE)

  const summarizeDiv = document.createElement('div')
  summarizeDiv.appendChild(summarizeButton)
  applyStyle(summarizeDiv, BUTTON_DIV_STYLE)

  return summarizeDiv
}

function applyStyle (node, style) {
  for (const key in style) {
    node.style[key] = style[key]
  }
}
