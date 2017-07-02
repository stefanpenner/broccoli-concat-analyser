#!/usr/bin/env node
'use strict';

var walk = require('walk-sync')
var fs = require('fs');
var path = require('path');
var Uglify = require('uglify-es');
var zlib = require('zlib');
var ora = require('ora');
var concatStatsForPath = process.argv[2];
var buildOuputSummary = require('./src/build-output-summary');
var usage = "using concat-stats:\n" + "   node concat-stats <path-to-concat-stats-directory>";
if (!concatStatsForPath) {
  console.log(usage);
  process.exit(1)
}

var entries = walk.entries(concatStatsForPath, { globs: ['*.json'], ignore: ['*.out.json'] });
function summarize(summaryPath) {
  var summary = JSON.parse(fs.readFileSync(path.join(concatStatsForPath, summaryPath), 'UTF8'));
  var basename = path.basename(summaryPath, '.json');

  var sizes = summary.sizes;
  delete summary.sizes;

  summary.files = Object.keys(sizes).map(function(relativePath) {
    var content = fs.readFileSync(path.join(concatStatsForPath, basename, relativePath), 'UTF8');
    var uglified, compressed;

      if (/\.js$/.test(relativePath)) {
        uglified = Uglify.minify(content);
        compressed = zlib.deflateSync(uglified.code, { level: 9 });
      } else {
        uglified = { code: { length: 'N/A'}};
        compressed = zlib.deflateSync(content, { level: 9 });
      }

    return {
      relativePath: relativePath,
      sizes: {
        raw: content.length,
        uglified: uglified.code.length,
        compressed: compressed.length,
      }
    }
  });


  fs.writeFileSync(path.join(concatStatsForPath, path.basename(summaryPath, '.json') + '.out.json'), JSON.stringify(summary, null, 2));
}

var spinner = ora('processing:').start();
entries.forEach(function(entry) {
  spinner.text = 'processing: ' + concatStatsForPath + entry.relativePath + ' > ' + concatStatsForPath + path.basename(entry.relativePath, '.json') + '.out.json';
  spinner.render();
  summarize(entry.relativePath);
});

spinner.text = 'complete, checkout: ' + concatStatsForPath + '*.out.json';
var cpr = require('cpr').cpr; //Back compat

cpr(__dirname + '/output', concatStatsForPath, {
  overwrite: true, //If the file exists, overwrite it
}, function(err, files) {
  spinner.stopAndPersist();
  if (err) { console.error(err); return }

  fs.writeFileSync(concatStatsForPath + '/summary.js', ' var SUMMARY = ' + JSON.stringify(buildOuputSummary(process.cwd() + '/concat-stats-for/'), null, 2));
  console.log('visit file://' + process.cwd() + '/concat-stats-for/index.html');
    //err - The error if any (err.list might be available with an array of errors for more detailed information)
    //files - List of files that we copied
});


