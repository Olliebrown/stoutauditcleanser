// Factory that generates a colorful logger object function-like object
export function makeLogger (label, backgroundColor, textColor) {
  const newLogger = logger.bind(this, label, backgroundColor, textColor)
  newLogger.error = error.bind(this, label, backgroundColor, textColor)
  return newLogger
}

// A colorful, easy to spot logger.  Only output if built in dev mode.
function logger (label, backgroundColor, textColor, ...rest) {
  if (_DEV_) {
    console.log(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
  }
}

// A colorful, easy to spot error logger. Outputs in all modes
function error (label, backgroundColor, textColor, ...rest) {
  console.error(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest)
}
