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
rescue
  # noop
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

if File.exist?('Gemfile.lock')
  if `grep -e "^BUNDLED WITH$" -A 1 Gemfile.lock | grep '    ' | grep -v "\(2\.3\.9\)"`.length > 1
    fail('gemfile.lock: Gemfile was not bundled with approved bundler version. Please use 2.3.9')
  end
end

if github.branch_for_head.start_with?('security')
  toggle_label(github, 'security', true)
end

git.commits.each do |c|
  has_migrations = c.diff_parent.any? { |f| f.path =~ %r{db/migrate/} }
  has_schema_changes = c.diff_parent.any? { |f| f.path =~ %r{db/schema\.rb} }

  should_have_migration_label = true if has_migrations || has_schema_changes
  toggle_label(github, 'run migration', should_have_migration_label)
end
