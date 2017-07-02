'use strict';

const expect = require('chai').expect;
const getTotal = require('../../src/get-total');

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

    expect(getTotal(files)).to.equal(1570);
  });

  it('gets any total size of all files', function() {
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

    expect(getTotal(files, 'raw')).to.equal(8100);
  });

});