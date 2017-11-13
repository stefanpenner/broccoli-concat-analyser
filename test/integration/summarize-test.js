'use strict';

const chai = require('chai');
const expect = chai.expect;
const tmp = require('tmp');
const chaiFiles = require('chai-files');
const file = chaiFiles.file;
const path = require('path');
const copyFixtures = require('../helpers/copy-fixtures');

const inputFixturePath = 'test/fixtures/input';
const outputFixturePath = 'test/fixtures/output';

const summarize = require('../../lib/summarize');
const summarizeAll = require('../../lib/summarize-all');

chai.use(chaiFiles);

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
      summarize(path.join(tmpPath, `${inputFile}.json`));

      expect(file(path.join(tmpPath, outputFile))).to.equal(file(path.join(outputFixturePath, outputFile)));
    });

  });

  describe('summarize-all', function() {

    it('calculates sizes of all files', function() {
      let inputFiles = ['1-test-app.js', '3-vendor.css', '8-test-support.css'];

      copyFixtures(inputFiles, inputFixturePath, tmpPath);
      summarizeAll(tmpPath);

      inputFiles.forEach((inputFile) => {
        let outputFile = `${inputFile}.out.json`;
        expect(file(path.join(tmpPath, outputFile))).to.equal(file(path.join(outputFixturePath, outputFile)));
      });
    });

  });
});

