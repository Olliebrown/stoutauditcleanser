// Necessary when using ECMA modules
import { jest } from '@jest/globals'

// Help load the program HTML page
import { InitProgramTest } from '../__testHelp__/_ProgramHelpers.js'
// Disable jest mocking for fs module
jest.dontMock('fs')

// Mock console.warn to disable output
console.warn = jest.fn()

describe('Mathematics Minor Node', () => {
  // Inject clean version of HTML page and rebuild program before tests
  let program = null
  beforeAll(() => {
    // Load page from imported HTML
    program = InitProgramTest('MinorInfoSecMgmt.html')
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
    expect(title.textContent).toBe('Minor Info Security Management')

    // Check program name
    expect(program).toBeTruthy()
    expect(program.getName()).toBe('Minor: InfoSec Mgmt')
  })

  test('should have expected snapshot', () => {
    expect(program?.toJSON()).toMatchSnapshot()
  })
})
