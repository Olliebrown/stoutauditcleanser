// Various queries and regex strings used throughout
export const QUERIES = {
  reqHeaders: '.PAGROUPDIVIDER',
  expander: '#DERIVED_SAA_DPR_SSS_EXPAND_ALL',
  expanderList: 'a[id^="DERIVED_SAA_DPR_GROUPBOX1"][aria-expanded="false"]',
  header: '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]',
  programTable: 'tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(5) > td:nth-child(2) tbody tbody'
}

export const REGEX = {
  generalRegEx: /(?:UNIVERSITY REQUIREMENTS)|(?:GENERAL INFORMATION)/i
}
