# bunyan-sqs

Stream node-bunyan logs to a SQS queue

# Early stage code ahead!

This is my first time digging into streams, so any tips, advice, or pull
requests are greatly appreciated.

# Installing

```
npm install bunyan-sqs
```

# Running tests

```
npm test
```

# Example

``` js
var bunyan = require('bunyan');
var bunyanSqs = require('bunyan-sqs');

var log = bunyan.createLogger({
  streams: [
    {
      stream: bunyanSqs.createStream({
        accessKeyId: 'KEY_ID',
        secretAccessKey: 'SECRET_KEY',
        region: 'AWS_REGION',
        queueName: 'NAME'
      })
    }
  ]
});
```
