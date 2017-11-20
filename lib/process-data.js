'use strict';

const filesize = require('filesize');
const getTotalHash = require('./get-total-hash');
const groupFiles = require('./group-files');
const amendGroupStats = require('./amend-group-stats');

/**
 * Given the contents of an *.out.json file, generate the grouped meta data required for final output
 *
 * @param outJson
 * @returns {{label: string, groups: groups, sizes: {raw, uglified, compressed}}}
 */
module.exports = function processData(outJson) {
  let sizes = getTotalHash(outJson.files);
  let total = sizes.compressed;
  let groups = groupFiles(outJson.files);
  groups.forEach(group => amendGroupStats(group, total));

  let label = outJson.outputFile.replace(/.*\/[simple_concat|source_map_concat].*\.tmp\//, '');
  return {
    label: `${label} (${filesize(total)})`,
    groups,
    sizes
  };
};