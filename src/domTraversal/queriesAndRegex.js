// Various queries and regex strings used throughout
export const QUERIES = {
  otherAcademicDropdown: '[name^="DERIVED_SSS_SCL_SSS_MORE_ACAD"]',
  otherAcademicGoButton: '[name^="DERIVED_SSS_SCL_SSS_GO"]',
  programHeader: '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]',
  requirementHeader: '.PAGROUPDIVIDER',
  subRequirementHeader: '.PSGROUPBOXLABEL',
  subRequirementDetails: '.PSLEVEL1SCROLLAREABODYNBO > tbody > tr',
  subRequirementDescription: '.PSLONGEDITBOX',
  expander: '#DERIVED_SAA_DPR_SSS_EXPAND_ALL',
  expanderList: 'a[id^="DERIVED_SAA_DPR_GROUPBOX1"][aria-expanded="false"]',
  showButton: 'a.PSLEVEL3GRIDLABEL:nth-child(2)',
  pageElement: (page) => `div[page="${page}"]`,
  programTable: (depth) => `tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(${depth}) > td:nth-child(2) tbody tbody`
}

export const REGEX = {
  generalHeader: /(?:GENERAL INFORMATION)/i,
  universityRequirements: /(?:UNIVERSITY REQUIREMENTS)|(?:HONORS COLLEGE OVERVIEW)/i,
  requirementDescription: /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s*(?<ID>[\w-]+):\s*(?<description>.*)\s*/i,
  subRequirementDescription: /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s*(?<description>.*)\s*/i,
  informationalOnly: /(?:Purpose of Academic Advisement Report)|(?:In-Progress Repeat Coursework)|(?:REMEDIAL\/PLACEMENT COURSEWORK INFORMATION)|(?:Graduation Information)|(?:Graduation With Honors Policy)/i,
  subReqUnits: /Units:\s+(?<req>[\d.]+)\s+required,\s+(?<taken>[\d.]+)\s+taken,\s+(?<need>[\d.]+)\s+needed/i
}
