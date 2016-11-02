var walkSync = require('walk-sync');
var fs = require('fs');
var filesize = require('filesize');

function prepareFiles(files) {
  let total = 0;

  files.forEach(x => x.label = x.relativePath + ' (' + filesize(x.sizes.compressed) + ')');
  files.forEach(x => total+= x.sizes.compressed);
  files.forEach(x => x.weight = x.sizes.compressed / total);

  return files;
}

function formatOut(out) {
  out.label = out.outputFile.replace(/.*\/simple_concat.*\.tmp\//, '');
  out.groups = prepareFiles(out.files);
  out.sizes = {
    raw: 0,
    uglified: 0,
    compressed: 0
  };

  out.groups.forEach(group => {
    out.sizes.raw += group.sizes.raw
    out.sizes.uglified += group.sizes.uglified
    out.sizes.compressed += group.sizes.compressed
  });

  out.label += ' (' + filesize(out.sizes.compressed) + ')';

  return out;
}


function rank(entries) {
  var total = entries.reduce((sum, entry) => entry.sizes.compressed + sum, 0);
  entries.forEach(entry => entry.rank = (entry.sizes.compressed / total));
  return entries;
}

module.exports = function outputSummary(path) {
  var entries = fs.readdirSync(path).
    filter(function(file) { return /\.out\.json$/.test(file); }).
    map(function(file) { return JSON.parse(fs.readFileSync(path + file, 'UTF8')); }).
    map(formatOut);
  return {
    groups: rank(entries)
  };
};
