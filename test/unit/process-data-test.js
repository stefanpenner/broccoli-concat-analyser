const expect = require('chai').expect;
const processData = require('../../src/process-data');

describe('process-data', function() {

  it('transforms build output to stats data', function() {
    let json = {
      outputFile: '/Users/johndoe/app/tmp/source_map_concat-output_path-ugMnYl8O.tmp/assets/vendor.js',
      files: [
        {
          relativePath: 'foo/bar.js',
          sizes: {
            raw: 100,
            uglified: 80,
            compressed: 70
          }
        },
        {
          'relativePath': 'foo/baz.js',
          sizes: {
            raw: 8000,
            uglified: 4000,
            compressed: 1500
          }
        }
      ]
    };

    let expected = {
      label: 'assets/vendor.js (1.53 KB)',
      sizes: {
        raw: 8100,
        uglified: 4080,
        compressed: 1570
      },
      groups: [
        {
          sizes: {
            raw: 100,
            uglified: 80,
            compressed: 70
          },
          label: 'foo/bar.js (70 B)',
          weight: 0.044585987261146494
        },
        {
          sizes: {
            raw: 8000,
            uglified: 4000,
            compressed: 1500
          },
          label: 'foo/baz.js (1.46 KB)',
          weight: 0.9554140127388535
        }
      ]
    };

    expect(processData(json)).to.deep.equal(expected);
  });

});