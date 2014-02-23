var test = require('tape');
var bsqs = require('../lib');

test('create without options when using a callback', function (t) {
  bsqs.createStream({}, function (error) {
    t.ok(error, 'should return an error');
    t.end();
  });
});
