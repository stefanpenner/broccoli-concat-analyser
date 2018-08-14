'use strict';

const path = require('path');
const fs = require('fs');
const buildOuputSummary = require('./build-output-summary');

module.exports = function createOutput(concatStatsForPath) {
  let summary = 'var SUMMARY = ' + JSON.stringify(buildOuputSummary(concatStatsForPath), null, 2);
  return fs.readFileSync(path.join(__dirname, '..', '/output', 'index.html'), 'UTF8')
    .replace('// INSERT SUMMARY //', summary);
};
