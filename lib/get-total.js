'use strict';

/**
 * Calculate the total size of all given files, based on key (raw|uglified|compressed)
 *
 * @param files
 * @param key
 * @returns {number}
 */
module.exports = function getTotal(files) {
  let key = arguments.length > 1 ? arguments[1] :  'compressed';
  return files.map(item => item.sizes[key])
    .reduce((value, total) => total + value, 0);
};