'use strict';

const chai = require('chai');
const expect = chai.expect;
const tmp = require('tmp');
const path = require('path');
const fs = require('fs-extra');

const outputFixturePath = 'test/fixtures/output';

const buildOutputSummary = require('../../lib/build-output-summary');

describe('build-output-summary', function() {
  let tmpPath;

  beforeEach(function() {
    tmpPath = tmp.dirSync().name;
    fs.copySync(outputFixturePath, tmpPath);
  });

  it('generates final summary output', function() {
    let result = buildOutputSummary(tmpPath);
    expect(result).to.deep.equal(fs.readJsonSync(path.join(outputFixturePath, 'build-output-summary.json')));
  });
});

