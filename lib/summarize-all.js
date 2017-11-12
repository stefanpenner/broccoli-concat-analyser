'use strict';

const path = require('path');
const summarize = require('./summarize');
const walk = require('walk-sync');

/**
 * Walk over all json files generated from broccoli-concat and write *.out.json containing size summary (uglified/compressed)
 * of all referenced files
 *
 * @param concatStatsForPath
 * @param cb
 */
module.exports = function summarizeAll(concatStatsForPath, cb) {
  const entries = walk.entries(concatStatsForPath, { globs: ['*.json'], ignore: ['*.out.json'] });
  entries.forEach(entry => {
    if (cb) {
      cb(entry);
    }
    summarize(path.join(concatStatsForPath, entry.relativePath));
  });
};
