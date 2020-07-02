# frozen_string_literal: true

def toggle_label(github, label, should_set)
  repo_name = github.pr_json['head']['repo']['full_name']
  pr_number = github.pr_json['number']
  has_label = github.pr_labels.include?(label)

  if should_set && !has_label
    github.api.add_labels_to_an_issue(repo_name, pr_number, [label])
  elsif !should_set && has_label
    github.api.remove_label(repo_name, pr_number, label)
  end
end

# Don't let testing shortcuts get into master by accident
if Dir.exist?('spec')
  fail('fdescribe left in tests') if `grep -r -e '\\bfdescribe\\b' spec/ |grep -v 'danger ok' `.length > 1
  fail('fcontext left in tests') if `grep -r -e '\\bfcontext\\b' spec/ |grep -v 'danger ok' `.length > 1
  fail('fit left in tests') if `grep -r -e '\\bfit\\b' spec/ | grep -v 'danger ok' `.length > 1
  fail('ap left in tests') if `grep -r -e '\\bap\\b' spec/ | grep -v 'danger ok' `.length > 1
  fail('puts left in tests') if `grep -r -e '\\bputs\\b' spec/ | grep -v 'danger ok' `.length > 1
end

if File.exist?('Gemfile')
  if `grep -r -e "^ *gem 'hubstaff_[a-z]\\+" Gemfile | grep -e ",.\\+[a-zA-Z]" `.length > 1
    fail('gemfile: Beta hubstaff_* gems are not allowed in master/production')
  end
  if `grep -r -e "^ *gem 'hubstaff_[a-z]\\+" Gemfile | grep -e ",.\\+'[~>=]\\+.\\+[a-zA-Z]" `.length > 1
    fail('gemfile: Beta hubstaff_* gems should be the exact version')
  end
  if `grep -r -e "^ *gem 'hubstaff_[a-z]\\+" Gemfile | grep -e ",.\\+[' ][0-9.]\\+'" | grep -v '~>' `.length > 1
    fail('gemfile: Release hubstaff_* gems should be using a ~> version')
  end
end

if github.branch_for_head.start_with?('security')
  toggle_label(github, 'security', true)
end

should_have_migration_label = false

git.commits.each do |c|
  short              = " ( #{c.sha[0..7]} )"
  has_migrations     = c.diff_parent.any? { |f| f.path =~ %r{db/migrate/} }
  has_schema_changes = c.diff_parent.any? { |f| f.path =~ %r{db/schema\.rb} }
  old_migration_msg  = c.message.start_with?('[migration]')
  has_migration_msg  = old_migration_msg || c.message.match?(/\Amigration(\([A-Za-z]+\))?:/)
  no_schema_ok       = ENV['DANGER_NO_SCHEMA_OK'] || false
  if has_migrations || has_schema_changes
    unless has_migration_msg
      fail 'migration: Schema migration commits needs to be tagged with (migration). e.g. migration(Module): ' + short
    end
    if old_migration_msg
      warn 'migration: Please switch to the new conventional commit format.'
    end
    if has_migrations && !has_schema_changes && !no_schema_ok
      fail 'migration: Please checkin your schema.rb changes with your migration' + short
    end
    if !has_migrations && has_schema_changes
      warn 'migration: Please checkin your migrations with your schema.rb changes' + short
    end
    if c.diff_parent.any? { |f| f.path !~ %r{db/migrate/|db/schema\.rb} }
      fail 'migration: Migration commit contains non-migration changes' + short
    end

    should_have_migration_label = true
  elsif has_migration_msg
    fail '[migration] Migration commit with no migrations!' + short
  end

  has_hubstaff_icon_changes = c.diff_parent.any? { |f| f.path =~ /hubstaff(icons|font)|fontcustom-manifest/ }
  if has_hubstaff_icon_changes
    if c.diff_parent.any? { |f| !(f.path =~ /hubstaff-(icons|font)/ || f.path =~ /fontcustom-manifest/) }
      fail 'hubstaff-icons: Put hubstaff-icon changes into their own commit' + short
    end
  end

  has_gemfile_changes = c.diff_parent.any? { |f| f.path =~ /Gemfile|gemspec/ }
  old_gemfile_msg     = c.message.start_with?('[gemfile]')
  has_gemfile_msg     = old_gemfile_msg || c.message.match?(/\Agemfile(\([A-Za-z]+\))?:/)
  if has_gemfile_changes
    unless has_gemfile_msg
      fail 'gemfile: Gemfile commits needs to be tagged with (gemfile). e.g. gemfile(Module): ' + short
    end
    if old_migration_msg
      warn 'gemfile: Please switch to the new conventional commit format.'
    end
    if c.diff_parent.any? { |f| f.path !~ /Gemfile|gemspec/ }
      fail 'gemfile: Gemfile commit contains non-gemfile changes' + short
    end
    if c.diff_parent.any? { |f| f.path == 'Gemfile.lock' }
      unless `grep -E -- '^BUNDLED WITH\s*\n\s+(1\\.15\\.2|1\\.17\\.3)$' Gemfile.lock`.length > 1
        fail('gemfile: Gemfile not bundled with bundler 1.15.2 or 1.17.3')
      end
    end
  elsif has_gemfile_msg
    fail 'gemfile: Gemfile commit has no gemfile changes!' + short
  end

  has_package_changes = c.diff_parent.any? { |f| f.path =~ /package\.json|yarn\.lock/ }
  old_package_msg     = c.message.start_with?('[package.json]')
  has_package_msg     = old_package_msg || c.message.match?(/\Apackage(\([A-Za-z]+\))?:/)
  if has_package_changes
    unless has_package_msg
      fail 'package: Package.json commits needs to be tagged with package. e.g package(Module): ' + short
    end
    if old_package_msg
      warn 'package: Please switch to the new conventional commit format.'
    end
    if c.diff_parent.any? { |f| f.path !~ /package\.json|yarn\.lock/ }
      fail 'package: Package.json commit contains non-package changes' + short
    end
  elsif has_package_msg
    fail 'package: Pacakge.json commit has no package changes!' + short
  end
end

toggle_label(github, 'run migration', should_have_migration_label)

if ENV['CIRCLE_TOKEN']
  require 'open-uri'

  artifact_url = "https://circleci.com/api/v1.1/project/github/#{ENV['CIRCLE_PROJECT_USERNAME']}/#{ENV['CIRCLE_PROJECT_REPONAME']}/#{ENV['CIRCLE_BUILD_NUM']}/artifacts?circle-token=#{ENV['CIRCLE_TOKEN']}"
  artifacts    = JSON.parse(URI.parse(artifact_url).read).map { |a| a['url'] }

  jest        = artifacts.find { |artifact| artifact.end_with?('jest/index.html') }
  coverage    = artifacts.find { |artifact| artifact.end_with?('coverage/index.html') }
  rubocop     = artifacts.find { |artifact| artifact.end_with?('rubocop/report.html') }
  eslint      = artifacts.find { |artifact| artifact.end_with?('eslint/report.html') }
  rspec_files = artifacts.select { |artifact| artifact =~ /rspec-(.+)\.html$/ }

  {}.tap do |hash|
    hash['Ruby coverage report']      = coverage if coverage
    hash['RSpec test report']         = rspec_files unless rspec_files.empty?
    hash['RuboCop inspection report'] = rubocop if rubocop
    hash['ESLint inspection report']  = eslint if eslint
    hash['Jest coverage report']      = jest if jest
  end.each do |msg, links|
    links = [*links]
    if links.size == 1
      message("[#{msg}](#{links[0]})")
    else
      r         = /rspec-(.+)\.html$/
      the_links = links.map { |l|
        m = r.match(l)
        if m
          "[#{m[1]}](#{l})"
        else
          "[link](#{l})"
        end
      }.join(', ')

      message("#{msg} - #{the_links}")
    end
  end
end
