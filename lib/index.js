var util = require('util');
var stream = require('stream');
var AWS = require('aws-sdk');

module.exports = {
  createStream: function (options, callback) {
    // Make sure we have all the values we'll need
    if (!options || !options.queueName) {
      var error = new Error('queueName is a required option');
      if (callback) return callback(error);
      throw error;
    }
    return new QueueStream(options);
  }
};

function QueueStream (options) {
  this.options = options;
  this.sqs = new AWS.SQS(options);
  this.logBuffer = [];

  // We can't push logs into the queue until we have its URL, hence our use of
  // this.logBuffer and this.write / this.send's use of a stack
  var self = this;
  this.sqs.getQueueUrl({
    QueueName: this.options.queueName
  }, function (error, data) {
    if (error) throw error;
    self.queueUrl = data.QueueUrl;
    self.send();
  });

  stream.Writable.call(this);
}

util.inherits(QueueStream, stream.Writable);

QueueStream.prototype.write = function (chunk, encoding, next) {
  this.logBuffer.push(chunk);
  if (this.queueUrl) {
    this.send();
  }
};

QueueStream.prototype.send = function () {
  if (this.logBuffer.length > 0) {
    var logEntry = this.logBuffer.shift();
    var self = this;
    this.sqs.sendMessage({
      QueueUrl: this.queueUrl,
      MessageBody: logEntry
    }, function (error, data) {
      // TODO: Revisit this. Potential loop here that will lock up a process.
      // Are logs *that* important? Should this be configurable?
      if (error) self.logBuffer.push(logEntry);
    });
    this.send();
  }
};
