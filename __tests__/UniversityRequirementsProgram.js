// Necessary when using ECMA modules
import { jest } from '@jest/globals'

// Help load the program HTML page
import { InitProgramTest } from '../__testHelp__/_ProgramHelpers.js'

// Disable jest mocking for fs module
jest.dontMock('fs')

describe('University Requirements Node', () => {
  // Inject clean version of HTML page and rebuild program before tests
  let program = null
  beforeAll(() => {
    // Load page from imported HTML
    program = InitProgramTest('UniversityProgram.html')
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
