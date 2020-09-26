# broccoli-concat-analyser

[![Build Status](https://travis-ci.org/stefanpenner/broccoli-concat-analyser.svg?branch=master)](https://travis-ci.org/stefanpenner/broccoli-concat-analyser)

---

When using a build chain based on [broccoli-concat](https://github.com/broccolijs/broccoli-concat),
this tool will show you the size and contents of the concatenated bundles, including:

* raw size
* uglified size (for JS right now)
* compressed size (including uglify if applicable)

![Example](https://user-images.githubusercontent.com/1325249/27770900-14ecfd58-5f47-11e7-8165-f44cb0ac2130.png)

[Interactive Demo](http://static.iamstef.net/concat-stats-example/)

## Ember addon

For usage in an Ember app, [ember-cli-bundle-analyzer](https://github.com/kaliber5/ember-cli-bundle-analyzer)
wraps this library as an Ember addon and integrates it more tightly into your development workflow. 

See the instructions on its [documentation page](https://github.com/kaliber5/ember-cli-bundle-analyzer).

## Usage

To directly use this tool, follow these steps: 

1. `npm install -g broccoli-concat-analyser`
2. `CONCAT_STATS=true ember s`
3. `broccoli-concat-analyser ./concat-stats-for`
4. open ./concat-stats-for/index.html in any browser for the foamtree interactive map

Notes:
* Be sure to have the latest version of broccoli-concat installed
* The process output can be found in the .out.json files in the directory: ./concat-stats-for
* Remove the ./concat-stats-for directory and run step 2 after any changes for an updated output

## Features

got ideas? Submit PRs!
