'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = function copyFixtures(names, srcPath, targetPath) {
  if (!Array.isArray(names)) {
    names = [names];
  }
  names.forEach((file) => {
    let filesPath = path.join(srcPath, file);
    if (fs.existsSync(filesPath)) {
      fs.copySync(filesPath, path.join(targetPath, file));
    }
    let jsonFile = `${file}.json`;
    fs.copySync(path.join(srcPath, jsonFile), path.join(targetPath, jsonFile));
  });
};
