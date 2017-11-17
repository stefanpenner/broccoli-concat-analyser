'use strict';

const fs = require('fs');
const path = require('path');
const Uglify = require('uglify-es');
const zlib = require('zlib');

/**
 * Given a single json file from broccoli-concat calculate the size summary (uglified/compressed) of all referenced files
 *
 * @param summaryPath
 */
module.exports = function summarize(summaryPath) {
  let input = JSON.parse(fs.readFileSync(summaryPath, 'UTF8'));
  let basename = path.basename(summaryPath, '.json');
  let dirname = path.dirname(summaryPath);

  let fileNames = Object.keys(input.sizes);
  let fileContents = {};
  fileNames.forEach((filename) => fileContents[filename] = fs.readFileSync(path.join(dirname, basename, filename), 'UTF8'));

  // we concatenate all files here to calculate the compressed size of the whole bundle. Calculating the compressed size
  // of all files individually and adding this up will yield an inaccurate result, as gzip will do a much better job
  // at compressing the whole bundle
  // @todo This could be avoided if broccoli-concat would give us the concatenated file it has created, but the `outputFile`
  // is currently a temporary file, which does not exist anymore when we run this, so we have to recreate it
  let concatenatedContent = Object.keys(fileContents)
    .map(filename => fileContents[filename])
    .join('\n');
  let compressed, baseSize;
  let isUglifyable = /\.js$/.test(input.outputFile);

  if (isUglifyable) {
    let uglified = Uglify.minify(concatenatedContent);
    compressed = zlib.deflateSync(uglified.code, { level: 9 });
    baseSize = uglified.code.length;
  } else {
    compressed = zlib.deflateSync(concatenatedContent, { level: 9 });
    baseSize = concatenatedContent.length;
  }
  let compressedSize = compressed.length;

  let files = fileNames.map(relativePath => {
    let content = fileContents[relativePath];
    let sizes = {
      raw: content.length
    };

    // assume the proportion of the compressed size is roughly the same as of the uglified/raw size
    if (isUglifyable) {
      sizes.uglified = Uglify.minify(content).code.length;
      sizes.compressed = sizes.uglified / baseSize * compressedSize;
    } else {
      sizes.compressed = content.length / baseSize * compressedSize;
    }

    return {
      relativePath,
      sizes
    }
  });

  let output = {
    outputFile: input.outputFile,
    files
  };

  fs.writeFileSync(path.join(dirname, basename + '.out.json'), JSON.stringify(output, null, 2));
};
