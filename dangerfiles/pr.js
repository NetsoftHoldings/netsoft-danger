import {danger, warn, fail, message} from "danger"

var sugar = {
    'test'	: exp => ( typeof(exp) === 'function' ? exp() : exp ),
    'fire'	: function( b ) { if( b ) { this.fn( this.msg ) } },
    'unless'	: function( exp ) { this.fire( ! this.test(exp) ); return Object.assign({ 'or' : this.unless }, this) },
    'if'	: function( exp ) { this.fire( this.test(exp) ); return Object.assign({ 'or' : this.if }, this) },
    'wrap'	: function( fn ) { return function( msg ) { return Object.assign( { 'msg': msg, 'fn': fn }, sugar ) } }
}

danger.message = sugar.wrap(message);
danger.warn = sugar.wrap(warn);
danger.fail = sugar.wrap(fail);


danger.fail('Please add labels to this PR')
    .unless( danger.github.issue.labels.length );

// Make it more obvious that a PR is a work in progress and shouldn't be merged yet
danger.warn("PR is a Work in Progress")
    .if( danger.github.issue.labels.includes('work in progress') )
    .or( danger.git.commits.find( c => c && c.message.includes('WIP') ) );

danger.fail( "Please provide a summary in the Pull Request description")
    .if( danger.github.pr.body.length < 5 );

danger.warn("Has not passed code-review")
    .unless(danger.github.issue.labels.includes('review passed'));

danger.warn("Has not passed QA")
    .unless( danger.github.issue.labels.includes('QA passed') );

danger.warn("PR base is not set to master!")
    .unless( danger.github.pr.base.ref.includes('master') );


// Warn when there is a big PR
danger.warn(':exclamation: Big PR')
    .if( 500 < danger.github.pr.additions + danger.github.pr.deletions );

danger.warn("Contains a fixup or squash commit")
    .if( danger.git.commits.find( c => c && c.message.match(/(fixup|squash)!/) ) );


