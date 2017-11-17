'use strict';

const filesize = require('filesize');
const getTotalHash = require('./get-total-hash');

/**
 * Add `sizes` and `weight` meta data to the given group, based on its child groups/files
 *
 * @param group
 * @param totalSize
 */
module.exports = function amendGroupStats(group, totalSize) {
  let groupTotal;

  if (group.sizes) {
    // stats already present
    groupTotal = group.sizes.compressed;

  } else {
    // new group, create stats from its children
    if (!group.groups) {
      throw new Error('Group has no children');
    }
    group.groups.forEach(group => amendGroupStats(group, totalSize));

    let sizes = getTotalHash(group.groups);
    groupTotal = sizes.compressed;
    group.sizes = sizes;
  }

  group.label += ` (${filesize(groupTotal)})`;
  group.weight = groupTotal / totalSize;
};