var walk = require('walk-sync')
var fs = require('fs');
var path = require('path');
var Uglify = require('uglify-js');
var zlib = require('zlib');
var ora = require('ora');
var concatStatsForPath = process.argv[2];

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
    var uglified;

      if (/\.js$/.test(relativePath)) {
        uglified = Uglify.minify(content, { fromString: true });
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
spinner.stopAndPersist();
