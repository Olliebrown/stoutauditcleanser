// Necessary when using ECMA modules
import { jest } from '@jest/globals'

// Help load the program HTML page
import { InitProgramTest } from '../__testHelp__/_ProgramHelpers.js'

// Disable jest mocking for fs module
jest.dontMock('fs')

describe('BS in AMCS: Interdisciplinary Program Node', () => {
  // Inject clean version of HTML page and rebuild program before tests
  let program = null
  beforeAll(() => {
    // Load page from imported HTML
    program = InitProgramTest('AMCSInterdiscipProgram.html')
  })

  // Clear out the HTML and program
  afterAll(() => {
    jest.resetModules()
    program = null
  })

  // Basic page structure tests
  test('should have a specific page title and specific program prefix', () => {
    // Check title & program name
    const titleElem = document.querySelector('title')
    expect(titleElem?.textContent).toBe('BS Applied Math Computer Science Interdisciplinary')
    expect(program?.getName()).toMatch(/^BS In AMCS: interdisciplinary CONC\s+\d\d\d\d$/)
  })

  test('should have expected snapshot', () => {
    expect(program?.toJSON()).toMatchSnapshot()
  })
})
