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

  s.files = `git ls-files`.split("\n").reject { |f|
    f.match?(%r{^\.github/}i)
  }
  s.require_paths = ['lib']

  s.required_ruby_version = '>= 2.4'

  s.add_runtime_dependency 'danger', '~> 8.0'
  s.add_runtime_dependency 'faraday'
  s.add_runtime_dependency 'simplecov', '~> 0.20.0'
  s.add_runtime_dependency 'thor'

  s.add_development_dependency 'rake'

  s.add_development_dependency 'netsoft-rubocop', '= 1.1.2'
end
