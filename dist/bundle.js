(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

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
  function getMainProgram(programNode) {
    return __async(this, null, function* () {
      const expander = programNode.querySelector("a[aria-expanded=false]");
      if (expander) {
        LOG("Clicking expander");
        expander.click();
      }
      const programRoot = programNode.parentNode.parentNode.parentNode;
      const descendIntoMadness = "tr:nth-child(2) > td tbody > tr:nth-child(2) > td:nth-child(2) tbody > tr:nth-child(2) td tbody > tr:nth-child(5) > td:nth-child(2) tbody tbody";
      let tries = 0;
      while (tries < MAX_RETRIES && programRoot.querySelector(descendIntoMadness) === null) {
        yield wait(1e3);
        tries++;
      }
      const mainTable = programRoot.querySelector(descendIntoMadness);
      if (!mainTable) {
        throw new Error("Max retries exceeded");
      } else {
        return mainTable;
      }
    });
  }
  function wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  function main() {
    return __async(this, null, function* () {
      const programNodes = getProgramNodes();
      if (!Array.isArray(programNodes) || programNodes.length < 1) {
        LOG.error("Failed to find program nodes");
      } else {
        try {
          const mainProgram = yield getMainProgram(programNodes[0]);
          LOG("Main Program is", mainProgram);
        } catch (err) {
          LOG.error("Failed to retrieve main program", err);
        }
      }
    });
  }
  main();
})();
//# sourceMappingURL=bundle.js.map
