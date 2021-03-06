// Various queries and regex strings used throughout
export const QUERIES = {
  programHeader: '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]',
  requirementHeader: '.PAGROUPDIVIDER',
  expander: '#DERIVED_SAA_DPR_SSS_EXPAND_ALL',
  expanderList: 'a[id^="DERIVED_SAA_DPR_GROUPBOX1"][aria-expanded="false"]',
  programTable: (depth) => `tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(${depth}) > td:nth-child(2) tbody tbody`
}

export const REGEX = {
  generalHeaders: /(?:UNIVERSITY REQUIREMENTS)|(?:GENERAL INFORMATION)/i,
  requirementDescription: /\s*(?<satisfied>(?:Not Satisfied)|(?:Satisfied)):\s*(?<ID>[\w-]+):\s*(?<description>.*)\s*/i
}
