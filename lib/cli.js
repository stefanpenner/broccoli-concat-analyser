#!/usr/bin/env node
'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const concatStatsForPath = process.argv[2];
const createOutput = require('./create-output');
const summarizeAll = require('./summarize-all');

const usage = "using concat-stats:\n" + "   node concat-stats <path-to-concat-stats-directory>";

if (!concatStatsForPath) {
  console.log(usage);
  process.exit(1)
}

const spinner = ora('processing...').start();
summarizeAll(path.resolve(concatStatsForPath))
  .then(() => {
    spinner.text = 'complete, checkout: ' + concatStatsForPath + '*.out.json';

    let content = createOutput(concatStatsForPath);
    fs.writeFileSync(concatStatsForPath + '/index.html', content);

    spinner.stopAndPersist();
    console.log('visit file://' + fs.realpathSync(concatStatsForPath) + '/index.html');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
