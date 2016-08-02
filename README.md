# yaktor-lang

> NOTE: This repository is no longer used and should be ignored.  It has been superceded by https://github.com/SciSpike/yaktor-dsl-xtext/tree/master/cli/src/main/npm in order to coordinate releases with yaktor-dsl-xtext.

Generate Node.js code from Domain & Conversation DSLs.  

## Description

Generate default implementation for a [Yaktor](https://github.com/Scispike/yaktor) project based on the `cl` and `dm` syntax.
The generated code can easily be extended and enhanced. As well you can maintain documentation which add value to the generated code.



## Usage

It is a thin wrapper around the Java command line runnable jar built by [yaktor-dsl-xtext](https://github.com/SciSpike/yaktor-dsl-xtext), so this module requires that `java` version `1.7.0` or later be on the machine's path whereon this module is run.

```bash
yaktor-lang files ...
```
Where files are `cl` and/or `dm` syntax files.

Run the above command from the root of your Yaktor project.  A common form of the command is to use `find`:

```bash
find . -name '*.dm' -o -name '*.cl'| xargs yaktor-lang
```

## For Yaktor developers

The following is information for those working on Yaktor itself.

### Version correspondence
In this repo, [semver](http://semver.org/) is employed, and prerelease versions are signifed with a `-pre.n` suffix, where `n` is the iteration of the prerelease version. However, in the Maven world of [yaktor-dsl-xtext](https://github.com/SciSpike/yaktor-dsl-xtext),
prereleases are signifed by a `-SNAPSHOT` suffix.  So, for example, version `1.0.0-pre.0` of this module will contain Maven artifact `io.yaktor:yaktor-xtext-dsl-cli:1.0.0-SNAPSHOT` in the `bin` directory, which resolves to file `bin/yaktor-xtext-dsl-cli-1.0.0-SNAPSHOT.jar`.  All prerelease iteration numbers (`n` from above) will map to `-SNAPSHOT`.

For non-prerelease versions, the version correspondence is one-to-one:  `yaktor-lang@1.0.0` will contain Maven artifact `io.yaktor:yaktor-xtext-dsl-cli:1.0.0` (`yaktor-xtext-dsl-cli-1.0.0.jar`), `yaktor-lang@1.0.1` will contain `yaktor-xtext-dsl-cli-1.0.1.jar`, and so on.

Essentially, the versions of this module and Maven artifact `io.yaktor:yaktor-dsl-text-cli` are linked; a change in one will force a change in the other, a process that must be manually enforced.

### Building

To build this module locally, first ensure that the Maven runnable jar artifact exists either in your local `.m2` repository or in a remote, then execute either `npm run fetch-cli` or `grunt fetch-cli` (the former simply delegates to the latter).  Alternatively, if you have a jar you need to test, it can be placed in the `bin` directory manually, ensuring that the jar filename is `yaktor-xtext-dsl-cli-version.jar`, where `version` matches this module's version according to the above section on version correspondence.

### Releasing

You can publish major releases, minor releases, patches & previews from this module.  The general pattern is to invoke `grunt release-xxx`, where `xxx` is `minor` (for major & minor releases — see below), `patch` for patches, or `pre` for preview releases.  All releases must meet the following preconditions prior to being released:

* there can be no untracked files (files ignored by `.gitignore` are ok, though)
* there can be no modified files (all files must be committed), and
* the version of Maven artifact `io.yaktor:yaktor-xtext-dsl-cli` corresponding to this module's version must be obtainable via the [`maven-dependency-plugin`](http://maven.apache.org/plugins/maven-dependency-plugin/index.html)'s [`copy`](http://maven.apache.org/plugins/maven-dependency-plugin/copy-mojo.html) goal.

In order to release, you must be logged in via `npm login` to an npm account that has authorization to publish releases from the Yaktor npm organization on [npmjs.com](https://www.npmjs.com).  Contact yaktor@scsipike.com for more information.

#### Branching strategy

The `master` branch contains the latest & greatest, and will normally have a `-pre.n` prerelease suffix in source control, where `n` is the next iteration of the prerelease, usually `0`.  It is the branch where releases almost always come from.

Once a major or minor release is published, a branch of the form `vm.n.x` is created, where `m` is the major version, `n` is the minor version, and `x` is the literal, `x`.  It is from this branch that patches are published, and a patch release is identified by a tag in this branch of the form `vm.n.p`, where `m` & `n` are the major & minor versions, respectively, and `p` is the patch version.

For example, if version `1.0.0` is released from `master`, the postconditions are

- a `v1.0.0` tag representing the commit from which the release came,
- a `v1.0.x` branch from which all patches will come containing the code as of the `v1.0.0` tag,
- the version in `package.json` in the `master` branch is `1.1.0-pre.0`, and
- the version in `package.json` in the `v1.0.x` branch is `1.0.1-pre.0`.

Further, if version `1.0.0` is patched & released,

* the tag `v1.0.1` is created to the commit in the `v1.0.x` branch & points to the commit representing the release, and
* the `package.json`'s version in the `v1.0.x` branch is bumped to `1.0.2-pre.0`

#### Major & minor releases

In addition to the release requirements above, major & minor releases are required to come from the `master` branch; there is machinery in `Gruntfile.js` to enforce this rule.  In order to perform the release, issue the command `npm run minor` or `grunt release-minor`.

It is worth noting that major releases are no different than minor releases, except that at some point, the decision was made to manually bump the version in `master`'s `package.json` to the next major version (like, for instance, `2.0.0-pre.0`).

In both the major & minor release scenarios, a new branch is created representing the release for that minor version.

#### Patch releases

In addition to the release requirements above, patch releases are required to come from the maintenance branch of the patch's minor release; there is machinery in `Gruntfile.js` to enforce this rule.  Once released, the postconditions are

* a tag is created in the maintenance branch & named after the patch version, and
* the `package.json` version is bumped to the next patch prelease level.

To release a patch, issue command `npm run patch` or `grunt release-patch`.

For example, if it's decided to release a patch in maintenance branch `v1.2.x` and the current `package.json` version is `1.2.3-pre.0`, then after the release command executes successfully, there will be a tag called `v1.2.3` pointing at the appropriate commit representing the release, and the `package.json` version in branch `v1.2.x` will be bumped to `1.2.4-pre.0`.

#### Preview releases

A preview release can be published at any time from any branch.  The requirements are simply those listed above for all releases.  Once released, the postconditions are

- a tag is created in the branch & named after the version in `package.json` at that time
- the `package.json` version is bumped to the next prerelease version.

To release a preview, issue command `npm run preview` or `grunt release-pre`.

For example, if it's decided to release preview version `2.0.0-pre.0` from `master`, then the `Gruntfile.js` creates tag `v2.0.0-pre.0`, publishes, then bumps the prerelease version to `2.0.0-pre.1`.
