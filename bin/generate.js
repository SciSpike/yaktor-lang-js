#!/usr/bin/env node
var args = process.argv.slice(2)
var path = require('path')
var cp = require('child_process')
var packageJson = path.join(path.dirname(module.filename), '..', 'package.json')
var version = require(packageJson).version.replace(/\-pre\.\d+$/, '-SNAPSHOT')
var jar = 'yaktor-xtext-dsl-cli-' + version + '.jar'
cp.spawn('java', ['-jar', path.join(path.dirname(module.filename), jar)].concat(args), {stdio: 'inherit'})
