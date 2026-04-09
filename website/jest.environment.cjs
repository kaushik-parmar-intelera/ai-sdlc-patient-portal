'use strict';
const JSDOMEnvironment = require('jest-environment-jsdom').default;

/**
 * Custom Jest environment that extends jsdom with Node.js 18+ Fetch API globals
 * (jsdom 20 does not include fetch, Request, Response, Headers)
 */
class CustomJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    // Expose Node.js 18+ Fetch API globals into the jsdom window
    const nodeGlobals = { Response, Request, Headers, fetch };
    for (const [key, value] of Object.entries(nodeGlobals)) {
      if (typeof value !== 'undefined' && typeof this.global[key] === 'undefined') {
        this.global[key] = value;
      }
    }
  }
}

module.exports = CustomJSDOMEnvironment;
