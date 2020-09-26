'use strict';

const fs = require('fs-extra');
const path = require('path');
const Terser = require('terser');
const zlib = require('zlib');
const pify = require('pify');

function uglify(content) {
  return new Promise((resolve, reject) => {
    let uglified = Terser.minify(content);
    if (uglified.error) {
      reject(uglified.error);
    } else {
      resolve(uglified.code);
    }
  });
}

function compress(content) {
  return pify(zlib.deflate)(content, { level: 9 });
}

/**
 * Given a single json file from broccoli-concat calculate the size summary (uglified/compressed) of all referenced files
 *
 * @param summaryPath
 * @return {Promise}
 */
module.exports = function summarize(summaryPath) {
  let input = JSON.parse(fs.readFileSync(summaryPath, 'UTF8'));
  let basename = path.basename(summaryPath, '.json');
  let dirname = path.dirname(summaryPath);

  let fileNames = Object.keys(input.sizes);
  let fileContents = {};
  fileNames.forEach((filename) => {
    try {
      fileContents[filename] = fs.readFileSync(path.join(dirname, basename, filename), 'UTF8');
    } catch(e) {
      if (e !== null && typeof e === 'object' && e.code === 'ENOENT') {
        // To provide backwards compability we support missing files, that are referenced in the metadata.
        // Typically these missing files are simple "optional" build files.
        //
        // Although broccoli-concat can properly handle this scenario, this
        // library should be maximally compatible for the time being.
        // eslint-disable-next-line no-console
        console.warn(`warning: '${filename}' is missing, and will be reported as an empty file. `);
        fileContents[filename] = '';
      } else {
        throw e;
      }
    }
  });

  // we concatenate all files here to calculate the compressed size of the whole bundle. Calculating the compressed size
  // of all files individually and adding this up will yield an inaccurate result, as gzip will do a much better job
  // at compressing the whole bundle
  // @todo This could be avoided if broccoli-concat would give us the concatenated file it has created, but the `outputFile`
  // is currently a temporary file, which does not exist anymore when we run this, so we have to recreate it
  let concatenatedContent = Object.keys(fileContents)
    .map(filename => fileContents[filename])
    .join('\n');
  let isUglifyable = /\.js$/.test(input.outputFile);

  return Promise.resolve()
    .then(() => {
      if (isUglifyable) {
        return uglify(concatenatedContent);
      } else {
        return concatenatedContent;
      }
    })
    .then(content => {
      return compress(content)
        .then(compressed => ({
          baseSize: content.length,
          compressedSize: compressed.length
        }))
    })
    .then(({ compressedSize, baseSize }) => {
      return Promise.all(fileNames.map(relativePath => {
        let content = fileContents[relativePath];

        return Promise.resolve()
          .then(() => {
            if (isUglifyable) {
              return uglify(content)
            }
          })
          .then((uglified) => {
            let uncompressedSize = uglified ? uglified.length : content.length;

            // assume the proportion of the compressed size is roughly the same as of the uglified/raw size
            return {
              relativePath,
              sizes: {
                raw: content.length,
                uglified: uglified ? uglified.length : undefined,
                compressed: uncompressedSize / baseSize * compressedSize
              }
            };
          });
      }));
    })
    .then((files) => {
      let output = {
        outputFile: input.outputFile,
        files
      };

      return fs.writeFile(path.join(dirname, basename + '.out.json'), JSON.stringify(output, null, 2));
    });
};
