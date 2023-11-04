// Various query selectors used for DOM traversal
export const QUERIES = {
  otherAcademicDropdown: '[name^="DERIVED_SSS_SCL_SSS_MORE_ACAD"]',
  otherAcademicGoButton: '[name^="DERIVED_SSS_SCL_SSS_GO"]',
  programHeader: '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]',
  requirementHeader: '.PAGROUPDIVIDER',
  requirementAltHeader: 'PSGROUPBOX',
  subRequirementHeader: 'div[id^="win0divDERIVED_SAA_DPR_GROUPBOX3GP"]',
  subRequirementDetails: '.PSLEVEL1SCROLLAREABODYNBO > tbody > tr',
  subRequirementDescription: '.PSLONGEDITBOX',
  expander: '#DERIVED_SAA_DPR_SSS_EXPAND_ALL',
  expanderList: 'a[id^="DERIVED_SAA_DPR_GROUPBOX1"][aria-expanded="false"]',
  showButton: 'a.PSLEVEL3GRIDLABEL:nth-child(2)',
  studentName: 'table.PABACKGROUNDINVISIBLE .PAPAGETITLE',
  pageDivId: 'pt_pageinfo_win0',
  pageElement: (page) => `div[page="${page}"]`,
  programTable: (depth) => `tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(${depth}) > td:nth-child(2) tbody tbody`
}

// Page IDs for the different iFrame pages
export const PAGE_IDS = {
  audit: 'SAA_SS_DPR_ADB',
  studentCenter: 'SSS_STUDENT_CENTER'
}

// Reverse lookup table for page IDs
export const PAGE_NAME_TO_ID = Object.fromEntries(
  Object.entries(PAGE_IDS).map(([key, value]) => [value, key])
)

// Regex for extracting information from audit
export const REGEX = {
  generalHeader: /(?:GENERAL INFORMATION)/i,
  universityRequirements: /(?:UNIVERSITY REQUIREMENTS)|(?:HONORS COLLEGE OVERVIEW)/i,
  requirementDescription: [
    /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s*(?<ID>[\w-]+):\s*(?<description>.*)\s*/i,
    /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s+(?<description>.*)\s+\((?<ID>[\w-]+)\)\s*/i,
    /\s*(?<ID>[\w-]+):\s+(?<description>.*)\s*/i
  ],
  subRequirementDescription: [
    /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s+\s+(?<description>.*)\((?<ID>[\w-]+)\)\s*/i,
    /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s+(?<ID>[\w-]+):\s+(?<description>.*)\s*/i,
    /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s*(?<description>.*)\s*/i
  ],
  informationalOnly: /(?:Purpose of Academic Advisement Report)|(?:In-Progress Repeat Coursework)|(?:REMEDIAL\/PLACEMENT COURSEWORK INFORMATION)|(?:Graduation Information)|(?:Graduation With Honors Policy)/i,
  credits: /Units:\s+(?<req>[\d.]+)\s+required,\s+(?<taken>[\d.]+)\s+taken,\s+(?<need>[\d.]+)\s+needed/i,
  courses: /Courses:\s+(?<req>[\d]+)\s+required,\s+(?<taken>[\d]+)\s+taken,\s+(?<need>[\d]+)\s+needed/i,
  gpa: /GPA:\s+(?<req>[\d.]+)\s+required,\s+(?<actual>[\d.]+)\s+actual/i
}
