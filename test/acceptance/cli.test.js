'use strict';

const tmp = require('tmp');
const path = require('path');
const cp = require('child_process');
const fs = require('fs-extra');
const validate = require('html-validator');
const copyFixtures = require('../helpers/copy-fixtures');

const inputFixturePath = 'test/fixtures/input';

const inputFiles = ['1-test-app.js', '3-vendor.css', '8-test-support.css'];

const originalCwd = process.cwd();
let tmpPath;
let outPath;

function file(dir) {
  return fs.readFileSync(dir, 'utf-8');
}

function run() {
  let stdout = '';
  let stderr = '';

  return new Promise(resolve => {
    let ps = cp.spawn('node', [
      path.join(originalCwd, 'lib/cli.js'),
      './concat-stats-for'
    ], {
      cwd: tmpPath
    });

    ps.stdout.on('data', data => {
      stdout += data.toString();
    });

    ps.stderr.on('data', data => {
      stderr += data.toString();
    });

    ps.on('exit', code => {
      resolve({
        exitCode: code,
        stdout,
        stderr
      });
    });
  });
}

describe('CLI', function() {

  beforeEach(function() {
    tmpPath = fs.realpathSync(tmp.dirSync().name);
    outPath = path.join(tmpPath, 'concat-stats-for');
    fs.ensureDirSync(outPath);
    copyFixtures(inputFiles, inputFixturePath, outPath);
  });

  it('generates expected output', function() {
    return run()
      .then(result => {
        let exitCode = result.exitCode;
        let stdout = result.stdout;

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`visit file://${outPath}/index.html`);

        // write .out.json files
        inputFiles.forEach((inputFile) => {
          let outputFile = `${inputFile}.out.json`;
          expect(file(path.join(outPath, outputFile))).toMatchSnapshot();
        });

        // copies static output files
        expect(file(path.join(outPath, 'index.html'))).toBeTruthy();

        let data = fs.readFileSync(`${outPath}/index.html`, 'UTF8');
        expect(data).toContain('var SUMMARY = {');

        return validate({
          data,
          format: 'json'
        })
          .then(response => {
            let error = response.messages.find(msg => msg.type === 'error');
            if (error) {
              throw new Error(`HTML validation error in index.html at L${error.lastLine}:${error.firstColumn}-${error.lastColumn}: ${error.message}\n${error.extract}`);
            }

          })
      });
  });

});

