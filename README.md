# Node-Express-Apache-Kafka Project   ![Version][version-image]

![Linux Build][linuxbuild-image]
![Windows Build][windowsbuild-image]
![NSP Status][nspstatus-image]
![Test Coverage][coverage-image]
![Dependency Status][dependency-image]
![devDependencies Status][devdependency-image]

The quickest way to get start with Node.Js, Express & Apache Kafka, just clone the project:

```bash
$ git clone https://github.com/arjunkhetia/Node.Js-Express-Apache-Kafka-Project.git
```

Install dependencies:

```bash
$ npm install
```

Start Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

# Apache Kafka (kafka.js)

Kafka is a messaging system that safely moves data between systems. Depending on how each component is configured, it can act as a transport for real-time event tracking or as a replicated distributed database. Although it is commonly referred to as a queue, it is more accurate to say that it is something in between a queue and a database, with attributes and tradeoffs from both types of systems.

| **Term**          | **Description**                                                                                                                                                                                                                                                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cluster           | The collective group of machines that Kafka is running on.                                                                                                                                                                                                                                                                               |
| Broker            | A single Kafka instance.                                                                                                                                                                                                                                                                                                                 |
| Topic             | Topics are used to organize data. You always read and write to and from a particular topic.                                                                                                                                                                                                                                              |
| Partition         | Data in a topic is spread across a number of partitions. Each partition can be thought of as a log file, ordered by time. To guarantee that you read messages in the correct order, only one member of a consumer group can read from a particular partition at a time.                                                                  |
| Producer          | A client that writes data to one or more Kafka topics.                                                                                                                                                                                                                                                                                   |
| Consumer          | A client that reads data from one or more Kafka topics.                                                                                                                                                                                                                                                                                  |
| Replica           | Partitions are typically replicated to one or more brokers to avoid data loss.                                                                                                                                                                                                                                                           |
| Leader            | Although a partition may be replicated to one or more brokers, a single broker is elected the leader for that partition, and is the only one who is allowed to write or read to/from that partition.                                                                                                                                     |
| Consumer group    | A collective group of consumer instances, identified by a groupId. In a horizontally scaled application, each instance would be a consumer and together they would act as a consumer group.                                                                                                                                              |
| Group Coordinator | An instance in the consumer group that is responsible for assigning partitions to consume from to the consumers in the group.                                                                                                                                                                                                            |
| Offset            | A certain point in the partition log. When a consumer has consumed a message, it "commits" that offset, meaning that it tells the broker that the consumer group has consumed that message. If the consumer group is restarted, it will restart from the highest committed offset.                                                       |
| Rebalance         | When a consumer has joined or left a consumer group (such as during booting or shutdown), the group has to "rebalance", meaning that a group coordinator has to be chosen and partitions need to be assigned to the members of the consumer group.                                                                                       |
| Heartbeat         | The mechanism by which the cluster knows which consumers are alive. Every now and then (heartbeatInterval), each consumer has to send a heartbeat request to the cluster leader. If one fails to do so for a certain period (sessionTimeout), it is considered dead and will be removed from the consumer group, triggering a rebalance. |

```js
const { Kafka, logLevel, CompressionTypes } = require("kafkajs");
const config = {
  clientId: "kafka-app",  // A logical identifier of an application. Can be used by brokers to apply quotas or trace requests to a specific application.
  brokers: ["localhost:9092"],  // Brokers is kafka servers of a statically configured list.
  connectionTimeout: 1000,  // Time in milliseconds to wait for a successful connection.
  requestTimeout: 30000,  // Time in milliseconds to wait for a successful request.
  ssl: false,  // The ssl option can be used to configure the TLS sockets.
  logLevel: logLevel.INFO, // NOTHING, ERROR, WARN, INFO, and DEBUG
  retry: {  // The retry option can be used to set the configuration of the retry mechanism, which is used to retry connections and API calls to Kafka (when using producers or consumers).
    maxRetryTime: 30000,  // Maximum wait time for a retry in milliseconds.
    initialRetryTime: 300,  // Initial value used to calculate the retry in milliseconds.
    retries: 5,  // Max number of retries per call.
    restartOnFailure: async () => true, // Only used in consumer. An async function that will be invoked after the consumer exhausts all retries, to decide whether or not to restart the consumer (essentially resetting consumer.run).
  },
};
const kafka = new Kafka(config);
const admin = kafka.admin();
const producerConfig = {
  allowAutoTopicCreation: true,
  transactionTimeout: 60000,
};
const producer = kafka.producer(producerConfig);
const consumerConfig = {
  groupId: "kafka-group",
  sessionTimeout: 30000,
  allowAutoTopicCreation: true,
};
const consumer = kafka.consumer(consumerConfig);
```

# Kafdrop

Kafdrop is a web UI for viewing Kafka topics and browsing consumer groups. The tool displays information such as brokers, topics, partitions, consumers, and lets you view messages.

## Kafdrop Screen - 

![Monitoring Page](https://github.com/arjunkhetia/Node.Js-Express-Apache-Kafka-Project/blob/main/public/kafdrop.png "Monitoring Page")

## API Response on HTML Page - 

![Monitoring Page](https://github.com/arjunkhetia/Node.Js-Express-Apache-Kafka-Project/blob/main/public/html.png "Monitoring Page")

## API Call on Postman - 

![Monitoring Page](https://github.com/arjunkhetia/Node.Js-Express-Apache-Kafka-Project/blob/main/public/postman.png "Monitoring Page")

# Nodemon

Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Start Express.js app with nodemon at `http://localhost:3000/`:

```bash
$ nodemon bin/www
```

# Node PortFinder

Node PortFinder is a tool to find an open port or domain socket on the machine.

```js
var portfinder = require('portfinder');
var port = 3000;
var portSpan = 999;
portfinder.getPort({
  port: port,    // minimum port number
  stopPort: port + portSpan // maximum port number
}, function (err, openPort) {
  if (err) throw err;
  port = openPort;
});
```

# Nodejs Cluster

Node.js runs in a single process, by default. Ideally, we want one process for each CPU core, so we can distribute the workload across all the cores. Hence improving the scalability of web apps handling HTTP requests and performance in general. In addition to this, if one worker crashes, the others are still available to handle requests.

```js
var cluster = require('cluster');
var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Master cluster is running on %s with %s workers', process.pid, workers);
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s on %s started', i+1, worker.pid);
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %s died. restarting...', worker.process.pid);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  // Server code
}
```

# Logger - Morgan & Winston

Morgan - HTTP request logger middleware for node.js:

```js
var logger = require('morgan');
app.use(logger('dev'));
app.use(logger(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
    stream: accessLogStream
}));
```

Winston - is designed to be a simple and universal logging library with support for multiple transports:

```js
var winston = require('winston');
var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(
        data => `${data.level} : ${data.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'silly'
    }),
    new winston.transports.File({
      level: 'silly',
      filename: './log/ServerData.log'
    })
  ]
});
```

# Rotating File Stream

To provide an automated rotation of Express/Connect logs or anything else that writes to a log on a regular basis that needs to be rotated based on date.

```js
var rfs    = require('rotating-file-stream');
var accessLogStream = rfs('file.log', {
    size:     '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: 'gzip' // compress rotated files
    path: 'log' // folder path for log files
});
```

# Server Status Monitor

Express Status Monitor is simple, self-hosted module based on Socket.io and Chart.js to report realtime server metrics for Express-based ode servers.

```js
app.use(require('express-status-monitor')({
  title: 'Server Status', // title for status screen
  path: '/status', // path for server status invokation
  spans: [{
    interval: 1, // every second
    retention: 60 // keep 60 datapoints in memory
  }],
  chartVisibility: {
    cpu: true, // enable CPU Usage
    mem: true, // enable Memory Usage
    load: true, // enable One Minute Load Avg
    responseTime: true, // enable Response Time
    rps: true, // enable Requests per Second
    statusCodes: true // enable Status Codes
  },
  healthChecks: [{
    protocol: 'http', // protocol
    host: 'localhost' // server host name
    path: '/users', // endpoint to check status
    port: '3000' // server port
  }] // health check will be considered successful if the endpoint returns a 200 status code
}));
```

![Monitoring Page](https://github.com/arjunkhetia/Node.Js-Express-Apache-Kafka-Project/blob/main/public/status-monitor.png "Monitoring Page")

[version-image]: https://img.shields.io/badge/Version-1.0.0-orange.svg
[linuxbuild-image]: https://img.shields.io/badge/Linux-passing-brightgreen.svg
[windowsbuild-image]: https://img.shields.io/badge/Windows-passing-brightgreen.svg
[nspstatus-image]: https://img.shields.io/badge/nsp-no_known_vulns-blue.svg
[coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[dependency-image]: https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg
[devdependency-image]: https://img.shields.io/badge/devdependencies-up_to_date-yellow.svg
