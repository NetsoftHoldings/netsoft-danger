# -*- encoding: utf-8 -*-
$:.push File.expand_path('../lib', __FILE__)
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

  s.add_development_dependency 'rake'
  s.add_runtime_dependency 'danger', '~> 5.0'
  s.add_runtime_dependency 'rubocop', '~> 0.74.0'
  s.add_runtime_dependency 'rubocop-rails', '~> 2.2.1'
  s.add_runtime_dependency 'rubocop-performance', '~> 1.4.1'
  s.add_runtime_dependency 'rubocop-rspec', '~> 1.35.0'
  s.add_runtime_dependency 'thor'
end
