'use strict';

const path = require('path');
const walk = require('walk-sync');
const workerpool = require('workerpool');

const pool = workerpool.pool(path.join(__dirname, 'summarize-worker.js'));

/**
 * Walk over all json files generated from broccoli-concat and write *.out.json containing size summary (uglified/compressed)
 * of all referenced files
 *
 * @param concatStatsForPath
 * @return {Promise}
 */
module.exports = function summarizeAll(concatStatsForPath) {
  const entries = walk.entries(concatStatsForPath, { globs: ['*.json'], ignore: ['*.out.json'] });
  return Promise.all(
    entries.map(entry => pool.exec('summarize', [path.join(concatStatsForPath, entry.relativePath)]))
  )
    .catch((err) => {
      pool.terminate();
      throw err;
    })
    .then(() => pool.terminate());
};
