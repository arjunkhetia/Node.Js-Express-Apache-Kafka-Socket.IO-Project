const { Kafka, logLevel, CompressionTypes } = require("kafkajs");

const config = {
  clientId: "kafka-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 1000,
  requestTimeout: 30000,
  ssl: false,
  logLevel: logLevel.INFO, // NOTHING, ERROR, WARN, INFO, and DEBUG
  retry: {
    maxRetryTime: 30000,
    initialRetryTime: 300,
    retries: 5,
    restartOnFailure: async () => true, // Only used in consumer.
  },
};

const kafka = new Kafka(config);

const admin = kafka.admin();

module.exports.admin = admin;

const producerConfig = {
  allowAutoTopicCreation: true,
  transactionTimeout: 60000,
};

const producer = kafka.producer(producerConfig);

module.exports.producer = producer;

const consumerConfig = {
  groupId: "kafka-group",
  sessionTimeout: 30000,
  allowAutoTopicCreation: true,
};

const consumer = kafka.consumer(consumerConfig);

module.exports.consumer = consumer;

module.exports.connect = () => {
  return Promise.all([
    new Promise((resolve, reject) => {
      admin
        .connect()
        .then(() => {
          console.log("Kafka admin got connected.");
          resolve();
        })
        .catch(() => {
          console.log("Kafka admin connection error.");
          reject();
        });
    }),
    new Promise((resolve, reject) => {
      producer
        .connect()
        .then(() => {
          console.log("Kafka producer got connected.");
          resolve();
        })
        .catch(() => {
          console.log("Kafka producer connection error.");
          reject();
        });
    }),
    new Promise((resolve, reject) => {
      consumer
        .connect()
        .then(() => {
          console.log("Kafka consumer got connected.");
          resolve();
        })
        .catch(() => {
          console.log("Kafka consumer connection error.");
          reject();
        });
    }),
  ]);
};

module.exports.disconnect = () => {
  admin
    .disconnect()
    .then(() => {
      console.log("Kafka admin got disconnected.");
    })
    .catch(() => {
      console.log("Kafka admin disconnection error.");
    });
  producer
    .disconnect()
    .then(() => {
      console.log("Kafka producer got disconnected.");
    })
    .catch(() => {
      console.log("Kafka producer disconnection error.");
    });
  consumer
    .disconnect()
    .then(() => {
      console.log("Kafka consumer got disconnected.");
    })
    .catch(() => {
      console.log("Kafka consumer disconnection error.");
    });
};

module.exports.send = (topic, messages) => {
  return new Promise((resolve, reject) => {
    producer
      .send({
        topic: topic,
        messages: messages,
        timeout: 30000,
        compression: CompressionTypes.GZIP,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.sendBatch = (topicMessages) => {
  return new Promise((resolve, reject) => {
    producer
      .sendBatch({
        topicMessages: topicMessages,
        timeout: 30000,
        compression: CompressionTypes.GZIP,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
