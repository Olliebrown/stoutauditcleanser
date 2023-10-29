import fs from 'fs'
import path from 'path'

// Project specific imports
import { QUERIES } from '../src/domTraversal/queriesAndRegex.js'
import Program from '../src/Objects/Program.js'

export function InitProgramTest (htmlFileName) {
  // Read in the HTML page
  const baseHTML = fs.readFileSync(
    path.join('__tests__', 'data', 'ProgramTables', htmlFileName),
    'utf8'
  )

  // Load page from imported HTML
  document.documentElement.innerHTML = baseHTML.toString()

  // Extract program headers and make sure there's at least one
  const headerNodes = document.querySelectorAll(QUERIES.programHeader)
  if (headerNodes?.length < 1) {
    throw new Error('Unable to find at least one program')
  }

  // Create program object
  return new Program(headerNodes[0])
}
