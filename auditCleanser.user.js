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

(function () {
  var config = {
    // Any config for the script can go here
  }

  // Ensure the script has been loaded, then launch it
  if (typeof window.AuditCleanser !== 'function') {
    // Download script as script tag
    var scriptTag = document.createElement('script')
    scriptTag.src = 'https://gitcdn.link/repo/olliebrown/stoutauditcleanser/master/src/dist/bundle.js'

    // Enable automatic running of main entry point
    scriptTag.onload = function () {
      window.AuditCleanser(config)
    }

    // Inject script
    document.head.appendChild(scriptTag)
  } else {
    // Script already loaded so launch main entry point
    window.AuditCleanser(config)
  }
})()
