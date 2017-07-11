'use strict';

const filesize = require('filesize');
const getTotal = require('./get-total');

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
    groupTotal = getTotal(group.groups);
    group.sizes = {
      raw: getTotal(group.groups, 'raw'),
      uglified: getTotal(group.groups, 'uglified'),
      compressed: groupTotal
    };
  }

  group.label += ` (${filesize(groupTotal)})`;
  group.weight = groupTotal / totalSize;
};