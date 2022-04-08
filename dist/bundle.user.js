// ==UserScript==
// @name         Stout Advising Audit Cleanser
// @namespace    https://github.com/olliebrown/stoutauditcleanser
// @version      0.1.0
// @description  Clean out unneeded from info from the advising audit and focus on what is needed only.
// @author       Seth Berrier
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uwstout.edu
// @include      https://access.uwstout.edu/*Page=SSS_ADVISEE_LIST*
// @grant        none
// ==/UserScript==

(() => {
  // src/logger.js
  function makeLogger(label, backgroundColor, textColor) {
    const newLogger = logger.bind(this, label, backgroundColor, textColor);
    newLogger.error = error.bind(this, label, backgroundColor, textColor);
    return newLogger;
  }
  function logger(label, backgroundColor, textColor, ...rest) {
    if (true) {
      console.log(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest);
    }
  }
  function error(label, backgroundColor, textColor, ...rest) {
    console.error(`%c[[${label}]]`, `background: ${backgroundColor}; color: ${textColor}`, ...rest);
  }

  // src/index.js
  var LOG = makeLogger("AUDIT_CLEANER", "yellow", "purple");
  var MAX_RETRIES = 10;
  function getProgramNodes() {
    const headerSelector = '[id*="DERIVED_SAA_DPR_GROUPBOX1GP"]';
    const headers = Array.from(document.querySelectorAll(headerSelector));
    const generalRegEx = /(?:UNIVERSITY REQUIREMENTS)|(?:GENERAL INFORMATION)/i;
    const programNodes = headers.filter((header) => !header.textContent.match(generalRegEx));
    return programNodes;
  }
  async function getMainProgram(programNode) {
    const expander = programNode.querySelector("a[aria-expanded=false]");
    if (expander) {
      LOG("Clicking expander");
      expander.click();
    }
    const programRoot = programNode.parentNode.parentNode.parentNode;
    const descendIntoMadness = "tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(5) > td:nth-child(2) tbody tbody";
    let tries = 0;
    while (tries < MAX_RETRIES && programRoot.querySelector(descendIntoMadness) === null) {
      await wait(1e3);
      tries++;
    }
    const mainTable = programRoot.querySelector(descendIntoMadness);
    if (!mainTable) {
      throw new Error("Max retries exceeded");
    } else {
      return mainTable;
    }
  }
  function wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async function main(config) {
    const programNodes = getProgramNodes();
    if (!Array.isArray(programNodes) || programNodes.length < 1) {
      LOG.error("Failed to find program nodes");
    } else {
      try {
        const mainProgram = await getMainProgram(programNodes[0]);
        LOG("Main Program is", mainProgram);
      } catch (err) {
        LOG.error("Failed to retrieve main program", err);
      }
    }
  }
  window.AuditCleanser = main;
})();
//# sourceMappingURL=bundle.user.js.map
