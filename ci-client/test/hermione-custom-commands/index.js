const assert = require('assert');

module.exports = function (hermione, opts) {
  hermione.on(hermione.events.NEW_BROWSER, function (browser) {
    browser.addCommand('assertExists', (selector, msg) => {
      return browser
        .isExisting(selector)
        .then(exists => assert.ok(exists, msg));
    });
  });
};