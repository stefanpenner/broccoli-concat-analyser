#!/usr/bin/env node
'use strict';

const walk = require('walk-sync')
const fs = require('fs');
const path = require('path');
const Uglify = require('uglify-es');
const zlib = require('zlib');
const ora = require('ora');
const concatStatsForPath = process.argv[2];
const buildOuputSummary = require('./src/build-output-summary');
const usage = "using concat-stats:\n" + "   node concat-stats <path-to-concat-stats-directory>";
if (!concatStatsForPath) {
  console.log(usage);
  process.exit(1)
}

const entries = walk.entries(concatStatsForPath, { globs: ['*.json'], ignore: ['*.out.json'] });

function summarize(summaryPath) {
  let summary = JSON.parse(fs.readFileSync(path.join(concatStatsForPath, summaryPath), 'UTF8'));
  let basename = path.basename(summaryPath, '.json');

  let sizes = summary.sizes;
  delete summary.sizes;

  summary.files = Object.keys(sizes).map(relativePath => {
    let content = fs.readFileSync(path.join(concatStatsForPath, basename, relativePath), 'UTF8');
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


  fs.writeFileSync(path.join(concatStatsForPath, path.basename(summaryPath, '.json') + '.out.json'), JSON.stringify(summary, null, 2));
}

const spinner = ora('processing:').start();
entries.forEach(entry => {
  spinner.text = 'processing: ' + concatStatsForPath + entry.relativePath + ' > ' + concatStatsForPath + path.basename(entry.relativePath, '.json') + '.out.json';
  spinner.render();
  summarize(entry.relativePath);
});

spinner.text = 'complete, checkout: ' + concatStatsForPath + '*.out.json';
const cpr = require('cpr').cpr; //Back compat

cpr(__dirname + '/output', concatStatsForPath, {
  overwrite: true, //If the file exists, overwrite it
}, (err, files) => {
  spinner.stopAndPersist();
  if (err) { console.error(err); return }

  fs.writeFileSync(concatStatsForPath + '/summary.js', ' var SUMMARY = ' + JSON.stringify(buildOuputSummary(process.cwd() + '/concat-stats-for/'), null, 2));
  console.log('visit file://' + process.cwd() + '/concat-stats-for/index.html');
    //err - The error if any (err.list might be available with an array of errors for more detailed information)
    //files - List of files that we copied
});


