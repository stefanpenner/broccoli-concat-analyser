#!/usr/bin/env node
'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const concatStatsForPath = process.argv[2];
const buildOuputSummary = require('./build-output-summary');
const summarizeAll = require('./summarize-all');

const usage = "using concat-stats:\n" + "   node concat-stats <path-to-concat-stats-directory>";

if (!concatStatsForPath) {
  console.log(usage);
  process.exit(1)
}

const spinner = ora('processing:').start();
summarizeAll(path.resolve(concatStatsForPath), function(entry) {
  spinner.text = 'processing: ' + concatStatsForPath + entry.relativePath + ' > ' + concatStatsForPath + path.basename(entry.relativePath, '.json') + '.out.json';
  spinner.render();
});

spinner.text = 'complete, checkout: ' + concatStatsForPath + '*.out.json';
const cpr = require('cpr').cpr; //Back compat

cpr(path.join(__dirname, '..', '/output'), concatStatsForPath, {
  overwrite: true, //If the file exists, overwrite it
}, (err/*, files*/) => {
  spinner.stopAndPersist();
  if (err) { console.error(err); return }
  let summary = 'var SUMMARY = ' + JSON.stringify(buildOuputSummary(process.cwd() + '/concat-stats-for/'), null, 2);
  let content = fs.readFileSync(concatStatsForPath + '/index.html', 'UTF8')
    .replace('// INSERT SUMMARY //', summary);

  fs.writeFileSync(concatStatsForPath + '/index.html', content);
  console.log('visit file://' + process.cwd() + '/concat-stats-for/index.html');
  //err - The error if any (err.list might be available with an array of errors for more detailed information)
  //files - List of files that we copied
});
