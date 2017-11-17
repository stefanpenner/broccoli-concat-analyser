'use strict';

const getTotal = require('./get-total');

const sizeKeys = ['raw', 'uglified', 'compressed'];

module.exports = function getTotalHash(files) {
  let sizes = {};
  sizeKeys.forEach((key) => {
    let total = getTotal(files, key);
    if (!isNaN(total)) {
      sizes[key] = total;
    }
  });
  return sizes;
}
