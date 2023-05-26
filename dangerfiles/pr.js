import {danger, warn, fail, message} from "danger";

var labels = danger.github.issue.labels.map(l => l.name);

const draft = danger.github.pr.draft || labels.includes('work in progress') || danger.git.commits.find(c => c && c.message.includes('WIP'))

const failNonDraft = (msg) =>  draft ? warn(msg) : fail(msg)

if (!danger.github.issue.labels.length) {
  failNonDraft('Please add labels to this PR');
}

// Make it more obvious that a PR is a work in progress and shouldn't be merged yet
failNonDraft("PR is a Work in Progress");

if (!(labels.includes('review passed') || labels.includes('code review passed'))) {
  failNonDraft("Has not passed code review");
}

if (!labels.includes('QA passed')) {
  failNonDraft("Has not passed QA");
}

// FIXME: Property 'milestone' does not exist on type 'GitHubPRDSL'.
if (!danger.github.pr.milestone) {
  failNonDraft('Requires a milestone before merging!');
} else {
  // we can do additional checks on the milestone name if we want.
  // e.g. inspect milestone.title or milestone.description
}


if ((danger.github.pr.body || '').length < 5) {
  fail("Please provide a summary in the Pull Request description");
}

if (labels.includes('product review needed')) {
  fail('Has not passed product review');
}

if (!danger.github.pr.base.ref.includes('master')) {
  fail("PR base is not set to master!");
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
