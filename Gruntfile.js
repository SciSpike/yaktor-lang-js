module.exports = function (grunt) {
  'use strict'
  require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  })
  var dir = null
  var basePath = grunt.option('basePath') || './'
  var path = require('path')
  var packageJson = require(path.resolve('package.json'))
  //tag could just use .version 
  //this is only used during minor releases
  //during minor releases the version is always x.x.0
  var tag = 'v' + packageJson.version.match(/^(\d+\.\d+\.\d+).*$/)[ 1 ]
  var newTag = tag.replace(/\.\d+$/, '.x')
  var master = grunt.option('source-branch') || 'master'
  var mvnGroupId = 'io.yaktor'
  var mvnArtifactId = 'yaktor-xtext-dsl-cli'
  // TODO: once we're publishing yaktor-dsl-xtext to Maven central, replace the following line with: var version = require(packageJson).version.replace(/\-pre\.\d+$/, '-SNAPSHOT') 
  var mvnVersion = packageJson.version.replace(/\-pre.*/, '') + '-SNAPSHOT'
  var mvnArtifact = [ mvnGroupId, mvnArtifactId, mvnVersion ].join(':')
  var jar = path.join('bin', [ mvnArtifactId, mvnVersion ].join('-') + '.jar')

  var config = {
    'basePath': basePath,
    'dir': dir,
    bump: {
      options: {
        files: './package.json',
        commit: true,
        commitMessage: 'Rev to v%VERSION%',
        commitFiles: [ '-a' ],
        push: true,
        pushTo: 'origin',
        'prereleaseName': 'pre',
        createTag: !grunt.option('no-tag'),
        pushTags: !grunt.option('no-tag')
      }
    },
    shell: {
      'publish': {
        command: [
          '[ -f ' + jar + ' ]', // correct jar must be there
          [ 'npm publish' ].join(' ')
        ].join('&&')
      },
      'pull': {
        command: 'git pull'
      },
      'add-owner': {
        command: [ 'npm owner add', grunt.option('owner'), packageJson.name ].join(' ')
      },
      'create-maintenance-branch': {
        command: [ 'git checkout -b ' + newTag + ' ' + tag,
          'git branch --set-upstream-to=origin/' + newTag + ' ' + newTag ].join('&&')
      },
      'create-tag': {
        command: 'git tag v' + packageJson.version
      },
      'release-minor': {
        'command': [
          "[ $(git status | head -n 1 | awk '{ print $3 }') == '" + master + "' ]", // minors only from master branch
          '[ -z "$(git status -s)" ]', // no untracked files
          'git diff --cached --exit-code --no-patch', // no modified files
          'grunt bump:minor',
          'grunt shell:fetch-cli', // get correct jar
          'grunt shell:publish',
          'grunt shell:create-maintenance-branch',
          'grunt bump:prepatch --no-tag',
          'git checkout master',
          'grunt bump:preminor --no-tag'
        ].join('&&'),
        help: 'Make a new release. You must do this in a clean working directory from the ' + master + ' branch.'
      },
      'release-patch': {
        'command': [
          "[[ $(git status | head -n 1 | awk '{ print $3 }') =~ ^v[0-9]+\.[0-9]+\.x$ ]]", // patches only from vM.m.x branches
          '[ -z "$(git status -s)" ]', // no untracked files
          'git diff --cached --exit-code --no-patch', // no modified files
          'grunt bump:patch',
          'grunt shell:fetch-cli', // get correct jar
          'grunt shell:publish',
          'grunt bump:prepatch --no-tag'
        ].join('&&'),
        help: 'Release a patch. You must do this in a clean working directory from a release branch, like \'v0.1.x\'.'
      },
      'release-pre': {
        'command': [
          '[ -z "$(git status -s)" ]', // no untracked files
          'git diff --cached --exit-code --no-patch', // no modified files
          'grunt shell:fetch-cli', // get correct jar
          'grunt shell:create-tag',
          'grunt shell:publish',
          'git push --tags',
          'grunt bump:prerelease --no-tag'
        ].join('&&'),
        help: 'Release a preview. You must do this in a clean working directory in any branch.'
      },
      'fetch-cli': {
        'command': 'mvn org.apache.maven.plugins:maven-dependency-plugin:2.10:copy -Dartifact=' + mvnArtifact + ' -DoverWriteSnapshots=true -DoutputDirectory=bin',
        help: 'Uses Maven to fetch the yaktor-dsl-xtext runnable command line jar'
      }
    }
  }

  grunt.initConfig(config)

  grunt.registerTask('add-owner', [ 'shell:add-owner' ])
  grunt.registerTask('release-patch', [ 'shell:pull', 'shell:release-patch' ])
  grunt.registerTask('release-minor', [ 'shell:pull', 'shell:release-minor' ])
  grunt.registerTask('release-pre', [ 'shell:pull', 'shell:release-pre' ])
  grunt.registerTask('fetch-cli', [ 'shell:pull', 'shell:fetch-cli' ])
}
