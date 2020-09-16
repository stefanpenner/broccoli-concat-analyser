'use strict';

const getTotal = require('../../lib/get-total');

describe('get-total', function() {

  it('gets total compressed size of all files', function() {
    let files = [
      {
        sizes: {
          raw: 100,
          uglified: 80,
          compressed: 70
        }
      },
      {
        sizes: {
          raw: 8000,
          uglified: 4000,
          compressed: 1500
        }
      }
    ];

    expect(getTotal(files)).toEqual(1570);
  });

  it('gets total raw size of all files', function() {
    let files = [
      {
        sizes: {
          raw: 100,
          uglified: 80,
          compressed: 70
        }
      },
      {
        sizes: {
          raw: 8000,
          uglified: 4000,
          compressed: 1500
        }
      }
    ];

    expect(getTotal(files, 'raw')).toEqual(8100);
  });

  it('ignores non-existing size key', function() {
    let files = [
      {
        sizes: {
          raw: 100,
          compressed: 70
        }
      },
      {
        sizes: {
          raw: 8000,
          compressed: 1500
        }
      }
    ];

    expect(getTotal(files, 'uglified')).toBeNaN;
  });

});