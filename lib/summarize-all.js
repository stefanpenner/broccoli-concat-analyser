'use strict';

const path = require('path');
const summarize = require('./summarize');
const walk = require('walk-sync');

module.exports = function summarizeAll(concatStatsForPath, cb) {
  const entries = walk.entries(concatStatsForPath, { globs: ['*.json'], ignore: ['*.out.json'] });
  entries.forEach(entry => {
    if (cb) {
      cb(entry);
    }
    summarize(path.join(concatStatsForPath, entry.relativePath));
  });
};
