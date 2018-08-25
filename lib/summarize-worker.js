const workerpool = require('workerpool');
const summarize = require('./summarize');

// create a worker and register public functions
workerpool.worker({
  summarize
});
