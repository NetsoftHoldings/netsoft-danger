# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Next]
### Added
### Changed
### Fixed

## [0.4.3]
### Added
- add brakeman artifact extraction
### Changed
- updated netsoft-rubocop and rubocop config
- remove old commit message style from checks
- update PR template

## [0.4.2]
### Fixed
- restrict simplecov version

## [0.4.1]
### Changed
- exclude binary files in the grep calls
- make PR base ~= master a hard error

## [0.4.0]
### Fixed
- correct simplecov merge on newer simplecov release

## [0.3.9]
### Fixed
- correct API call to github for adding labels and fix logic in determining if we should or should not add the label

## [0.3.8]
### Added
- auto add/remove some labels
- allow conventional commit format for our migration, gemfile, and package.json
- add support for product review labels
- add support for renamed code review labels

## [0.3.7]
### Fixed
- require English in the netsoft-circle bin

## [0.3.6]
### Added
- rubocop checks for this gem
### Changed
- allow bundler 1.17.3

## [0.3.5]
### Added
- package.json checks
### Fixed
- requie older version of faraday until octokit is fixed (https://github.com/octokit/octokit.rb/pull/1154)

