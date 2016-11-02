# broccoli-concat-analyser

produces:

* raw size
* uglified size (for JS right now)
* compressed size (including uglify if applicable)

![Example](https://cloud.githubusercontent.com/assets/1377/19917272/efe1027a-a07e-11e6-9097-0a9a121d3dd2.png)

[Interactive Demo](http://static.iamstef.net/concat-stats-example/)

## usage

0. `npm install -g broccoli-concat-analyser`
1. using broccoli-concat (latest versions)
2. `CONCAT_STATS=true ember s`
3. `broccoli-concat-analyser ./concat-stats-for`
4. look at .out.json files in ./concat-stats-for for the process output

## Features

got ideas? Submit PRs!
