'use strict';

const processData = require('../../lib/process-data');

const broccoliPaths = [
  '/Users/johndoe/app/tmp/source_map_concat-output_path-ugMnYl8O.tmp',
  '/tmp/broccoli-3547RkycwsoEoJtx/out-086-source_map_concat_packaged_application_javascript'
];

describe('process-data', function() {

  broccoliPaths.forEach((path) => {
    it('transforms build output to stats data', function() {
      let json = {
        outputFile: `${path}/assets/vendor.js`,
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
              raw: 8100,
              uglified: 4080,
              compressed: 1570
            },
            label: 'foo (1.53 KB)',
            weight: 1570,
            groups: [
              {
                sizes: {
                  raw: 100,
                  uglified: 80,
                  compressed: 70
                },
                label: 'bar.js (70 B)',
                weight: 70
              },
              {
                sizes: {
                  raw: 8000,
                  uglified: 4000,
                  compressed: 1500
                },
                label: 'baz.js (1.46 KB)',
                weight: 1500
              }
            ]
          }
        ]
      };

      expect(processData(json)).toEqual(expected);
    });
  });
});
