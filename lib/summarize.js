'use strict';

const fs = require('fs');
const path = require('path');
const Uglify = require('uglify-es');
const zlib = require('zlib');

/**
 * Given a single json file from broccoli-concat calculate the size summary (ulgified/compressed) of all referenced files
 *
 * @param summaryPath
 */
module.exports = function summarize(summaryPath) {
  let summary = JSON.parse(fs.readFileSync(summaryPath, 'UTF8'));
  let basename = path.basename(summaryPath, '.json');
  let dirname = path.dirname(summaryPath);

  let sizes = summary.sizes;
  delete summary.sizes;

  summary.files = Object.keys(sizes).map(relativePath => {
    let content = fs.readFileSync(path.join(dirname, basename, relativePath), 'UTF8');
    let uglified, compressed;

    if (/\.js$/.test(relativePath)) {
      uglified = Uglify.minify(content);
      compressed = zlib.deflateSync(uglified.code, { level: 9 });
    } else {
      uglified = { code: { length: 'N/A'}};
      compressed = zlib.deflateSync(content, { level: 9 });
    }

    return {
      relativePath,
      sizes: {
        raw: content.length,
        uglified: uglified.code.length,
        compressed: compressed.length,
      }
    }
  });

  fs.writeFileSync(path.join(dirname, basename + '.out.json'), JSON.stringify(summary, null, 2));
};
