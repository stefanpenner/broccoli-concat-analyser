function getTotal(files, key = 'compressed') {
  return files.map(item => item.sizes[key])
    .reduce((value, total) => total + value, 0);
}

module.exports = getTotal;