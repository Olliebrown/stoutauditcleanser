const ABBREVIATIONS = {
  // Make all of the 'and' usage consistent
  and: '&',

  // Make dash vs colon usage consistent
  '- ': ': ',
  ' : ': ': ',
  'CONC-': 'CONC: ',
  'MINOR-': 'Minor: ',
  'science-': 'science: ',

  // Common abbreviations for degrees
  bs: 'BS',
  'b.s.': 'BS',
  'bachelor of science': 'BS',
  ba: 'BA',
  'b.a.': 'BA',
  'bachelor of arts': 'BA',
  mfa: 'MFA',
  'master of fine arts': 'MFA',
  edd: 'EdD',
  'doctor of education': 'EdD',
  phd: 'PhD',
  'doctor of philosophy': 'PhD',

  // Common abbreviations for concentrations
  concentration: 'CONC',
  'game design & development': 'GDD',
  'Cyber Security': 'CyberSec',
  Cybersecurity: 'CyberSec',
  'Cyber Defense': 'CyberDef',
  'Secure Software Development': 'SecSoftDev',
  'Information Security': 'InfoSec',
  Management: 'Mgmt',

  // Common abbreviations for programs
  'computer science': 'CS',
  'applied math & CS': 'AMCS',
  'Applied Mathematics & CS': 'AMCS',
  'COMPUTER NETWORKING & INFORMATION TECHNOLOGY': 'CNIT',
  'COMPUTER NETWORKING AND INFORMATION TECHNOLOGY': 'CNIT',

  // Gen Ed abbreviations
  'General Education': 'GenEd',
  'Racial & Ethnic Studies': 'RES',
  'Global Perspectives': 'GLP',
  'Analytic Reasoning & Natural Science': 'ARNS',
  'Humanities & the Arts': 'HumArt',
  'Social & Behavioral Sciences': 'SBSci',
  'Cross-disciplinary Issues': 'CI',
  'Social Responsibility & Ethical Reasoning': 'SRER',

  // Other common abbreviations
  gpa: 'GPA'
}

// Look for known abbreviations (case-insensitive) in the string and replace them
export function abbreviate (str) {
  let result = str
  for (const [key, value] of Object.entries(ABBREVIATIONS)) {
    const regex = new RegExp(key, 'i')
    result = result.replace(regex, value)
  }
  return result
}

// Convert a string to title case (e.g. 'hello world' -> 'Hello World')
export function toTitleCase (str) {
  return str.replace(
    /\w\S*/g,
    (txt) => (
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  )
}

// Convert a string to a key that can be used in a variable name
export function makeKey (str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
}
