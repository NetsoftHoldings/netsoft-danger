# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('lib', __dir__)
require 'netsoft-danger/version'

Gem::Specification.new do |s|
  s.name        = 'netsoft-danger'
  s.version     = NetsoftDanger::VERSION
  s.authors     = ['urkle']
  s.email       = []
  s.homepage    = 'https://github.com/NetsoftHoldings/danger'
  s.summary     = 'Danger.systems conventions for Netsoft projects.'
  s.description = 'Packages a Dangerfile to be used with Danger.'
  s.executables << 'netsoft-circle'

  s.files         = `git ls-files`.split("\n")
  s.require_paths = ['lib']

  s.add_runtime_dependency 'danger', '~> 5.0'
  s.add_runtime_dependency 'faraday'
  s.add_runtime_dependency 'simplecov', '~> 0.20.0'
  s.add_runtime_dependency 'thor'

  s.add_development_dependency 'rake'

  s.add_development_dependency 'netsoft-rubocop', '= 1.0.1'
  s.add_development_dependency 'rubocop', '= 0.74.0'
  s.add_development_dependency 'rubocop-performance', '= 1.5.2'
  s.add_development_dependency 'rubocop-rails', '= 2.4.2'
  s.add_development_dependency 'rubocop-rspec', '= 1.38.1'
end
