'use strict';

const tmp = require('tmp');

const buildOutputSummary = require('../../lib/build-output-summary');

describe('build-output-summary', function() {
  let tmpPath;
  beforeEach(function() {
    tmpPath = tmp.dirSync().name;
  });
  it('generates final summary output', function() {
    let result = buildOutputSummary(tmpPath);
    expect(result).toMatchSnapshot();
  });
});

