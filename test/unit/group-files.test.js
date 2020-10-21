'use strict';

const groupFiles = require('../../lib/group-files');

describe('group-files', function() {

  it('it transforms flat list of files to nested groups', function() {
    let files = [
      {
        relativePath: 'foo/bar.js',
        sizes: {
          raw: 100,
          uglified: 80,
          compressed: 70
        }
      },
      {
        relativePath: 'foo/baz.js',
        sizes: {
          raw: 8000,
          uglified: 4000,
          compressed: 1500
        }
      }
    ];

    let expected = [
      {
        label: 'foo',
        groups: [
          {
            label: 'bar.js',
            sizes: {
              raw: 100,
              uglified: 80,
              compressed: 70
            }
          },
          {
            label: 'baz.js',
            sizes: {
              raw: 8000,
              uglified: 4000,
              compressed: 1500
            }
          }
        ]
      }
    ];

    expect(groupFiles(files)).toEqual(expected);
  });

});