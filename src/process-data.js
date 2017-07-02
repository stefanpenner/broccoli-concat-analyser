const filesize = require('filesize');

function prepareFiles(files) {
  let total = 0;

  let result = files.map(x => ({ label: `${x.relativePath} (${filesize(x.sizes.compressed)})`, sizes: x.sizes}));

  files.forEach(x => total += x.sizes.compressed);
  result.forEach(x => x.weight = x.sizes.compressed / total);

  return result;
}

function processData(outJson) {
  let out = {};
  out.label = outJson.outputFile.replace(/.*\/[simple_concat|source_map_concat].*\.tmp\//, '');
  out.groups = prepareFiles(outJson.files);
  out.sizes = {
    raw: 0,
    uglified: 0,
    compressed: 0
  };

  out.groups.forEach(group => {
    out.sizes.raw += group.sizes.raw;
    out.sizes.uglified += group.sizes.uglified;
    out.sizes.compressed += group.sizes.compressed
  });

  out.label += ' (' + filesize(out.sizes.compressed) + ')';

  return out;
}

module.exports = processData;