// Necessary when using ECMA modules
import { jest } from '@jest/globals'

// Setup basic HTML page before each test
import fs from 'fs'
import path from 'path'

// Project specific imports
import { QUERIES } from '../src/domTraversal/queriesAndRegex.js'
import Program from '../src/Objects/Program.js'

// Read in the HTML page
const baseHTML = fs.readFileSync(path.join('__tests__', 'data', 'UniversityProgram.html'), 'utf8')

// Disable jest mocking for fs module
jest.dontMock('fs')

describe('General Info Node', () => {
  // Inject clean version of HTML page and rebuild program before tests
  let program = null
  beforeAll(() => {
    // Load page from imported HTML
    document.documentElement.innerHTML = baseHTML.toString()

    // Extract program headers and make sure there's at least one
    const headerNodes = document.querySelectorAll(QUERIES.programHeader)
    if (headerNodes?.length < 1) {
      throw new Error('Unable to find at least one program')
    }

    // Create program object
    program = new Program(headerNodes[0])
  })

  // Clear out the HTML and program
  afterAll(() => {
    jest.resetModules()
    program = null
  })

  // Basic page structure tests
  test('should have a specific page title and specific program name', () => {
    // Check title
    const title = document.querySelector('title')
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('University Requirements')

    // Check program name
    expect(program).toBeTruthy()
    expect(program.getName()).toBe('University Requirements For Graduation')
  })
})
