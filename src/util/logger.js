// Factory that generates a colorful logger object function-like object
export function makeLogger (label, backgroundColor, textColor, indent = 0) {
  const newLogger = logger.bind(this, label, backgroundColor, textColor, indent)
  newLogger.green = green.bind(this, label, backgroundColor, textColor, indent)
  newLogger.red = red.bind(this, label, backgroundColor, textColor, indent)
  newLogger.error = error.bind(this, label, backgroundColor, textColor, indent)
  return newLogger
}

// A colorful, easy to spot logger.  Only output if built in dev mode.
function logger (label, backgroundColor, textColor, indent, ...rest) {
  if (_DEV_) {
    console.log(`${'\t'.repeat(indent)}%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
  }
}

// Log text with a green background
function green (label, backgroundColor, textColor, indent, ...rest) {
  let output = rest.join(' ')
  if (!output.includes('%c')) {
    output = `%c${output}`
  }

  console.log(
    `${'\t'.repeat(indent)}%c[[${label}]]%c ${output}`,
    `background: ${backgroundColor}; color: ${textColor}`,
    'background: white; color, black',
    'background: lightgreen; color: black'
  )
}

// Log text with a red background
function red (label, backgroundColor, textColor, indent, ...rest) {
  let output = rest.join(' ')
  if (!output.includes('%c')) {
    output = `%c${output}`
  }

  console.log(
    `${'\t'.repeat(indent)}%c[[${label}]]%c ${output}`,
    `background: ${backgroundColor}; color: ${textColor}`,
    'background: white; color, black',
    'background: tomato; color: black'
  )
}

// A colorful, easy to spot error logger. Outputs in all modes
function error (label, backgroundColor, textColor, indent, ...rest) {
  console.error(`${'\t'.repeat(indent)}%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
}
