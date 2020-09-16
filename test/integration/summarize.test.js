'use strict';

const tmp = require('tmp');
const path = require('path');
const copyFixtures = require('../helpers/copy-fixtures');
const fs = require('fs-extra');

const inputFixturePath = 'test/fixtures/input';

const summarize = require('../../lib/summarize');
const summarizeAll = require('../../lib/summarize-all');

function file(dir) {
  return fs.readFileSync(dir, 'utf-8');
} 

describe('summarize', function() {
  let tmpPath;

  beforeEach(function() {
    tmpPath = tmp.dirSync().name;
  });

  describe('summarize', function() {

    it('calculates sizes', function() {
      let inputFile = '1-test-app.js';
      let outputFile = '1-test-app.js.out.json';

      copyFixtures(inputFile, inputFixturePath, tmpPath);
      return summarize(path.join(tmpPath, `${inputFile}.json`))
        .then(() => expect(file(path.join(tmpPath, outputFile))).toMatchSnapshot());
    });

    it('rejects promise on minification errors', function() {
      let inputFile = '1-test-app.js';

      copyFixtures(inputFile, inputFixturePath, tmpPath);
      // this will cause terser to fail
      fs.writeFileSync(path.join(tmpPath, inputFile, 'test-app/app.js'), 'foo(;', { flag: 'a' });

      let promise = summarize(path.join(tmpPath, `${inputFile}.json`));
      return expect(promise).to.be.rejected
        .and.to.eventually.have.property('message')
        .match(/Unexpected token/);
    });

  });

  describe('summarize-all', function() {

    it('calculates sizes of all files', function() {
      let inputFiles = ['1-test-app.js', '3-vendor.css', '8-test-support.css'];

      copyFixtures(inputFiles, inputFixturePath, tmpPath);
      return summarizeAll(tmpPath)
        .then(() => {
          inputFiles.forEach((inputFile) => {
            let outputFile = `${inputFile}.out.json`;
            expect(file(path.join(tmpPath, outputFile))).toMatchSnapshot();
          });
        });
    });

    it('can ignore files', function() {
      let inputFiles = ['1-test-app.js', '3-vendor.css', '8-test-support.css'];
      let ignore = 'test-support.css';
      copyFixtures(inputFiles, inputFixturePath, tmpPath);
      return summarizeAll(tmpPath, ignore)
        .then(() => {
          inputFiles.forEach((inputFile) => {
            let outputFile = `${inputFile}.out.json`;
            if (inputFile === '8-test-support.css') {
              expect(file(path.join(tmpPath, outputFile))).not.toBeTruthy();
            } else {
              expect(file(path.join(tmpPath, outputFile))).toMatchSnapshot();
            }
          });
        });
    });

  });
});

