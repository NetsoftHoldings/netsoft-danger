import {danger, warn, fail, message} from "danger";

if (!danger.github.issue.labels.length) {
  fail('Please add labels to this PR');
}

var labels = danger.github.issue.labels.map(l => l.name);

// Make it more obvious that a PR is a work in progress and shouldn't be merged yet
if (labels.includes('work in progress') || danger.git.commits.find(c => c && c.message.includes('WIP'))) {
  fail("PR is a Work in Progress");
}

if (danger.github.pr.body.length < 5) {
  fail("Please provide a summary in the Pull Request description");
}

if (!labels.includes('review passed')) {
  fail("Has not passed code-review");
}

if (!labels.includes('QA passed')) {
  fail("Has not passed QA");
}

if (!danger.github.pr.base.ref.includes('master')) {
  warn("PR base is not set to master!");
}

// Warn when there is a big PR
if (500 < (danger.github.pr.additions + danger.github.pr.deletions)) {
  warn(':exclamation: Big PR');
}

if (danger.git.commits.find(c => c && c.message.match(/Merge branch/))) {
  fail('Please rebase to remove merge commits in this PR');
}

if (danger.git.commits.find(c => c && c.message.match(/(fixup|squash)!/))) {
  fail("Contains a fixup or squash commit");
}

