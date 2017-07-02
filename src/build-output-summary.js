const fs = require('fs');
const processData = require('./process-data');

function rank(entries) {
  let total = entries.reduce((sum, entry) => entry.sizes.compressed + sum, 0);
  entries.forEach(entry => entry.rank = (entry.sizes.compressed / total));
  return entries;
}

module.exports = function outputSummary(path) {
  let entries = fs.readdirSync(path).
    filter(function(file) { return /\.out\.json$/.test(file); }).
    map(function(file) { return JSON.parse(fs.readFileSync(path + file, 'UTF8')); }).
    map(processData);
  return {
    groups: rank(entries)
  };
};
