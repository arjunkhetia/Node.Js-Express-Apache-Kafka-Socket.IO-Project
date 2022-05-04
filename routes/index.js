var express = require("express");
var router = express.Router();
var kafka = require("../kafka");
const { HEARTBEAT } = kafka.consumer.events;

const topic = "kafka-topic";
var resultData = [];

const init = async () => {
  // kafka.consumer.on(HEARTBEAT, e => console.log(`heartbeat at ${e.timestamp}`));

  await kafka.consumer.subscribe({
    topic: topic,
    fromBeginning: true,
  });

  await kafka.consumer.run({
    // autoCommitInterval: 5000,
    // autoCommitThreshold: 100,
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      data = {
        topic: topic,
        partition: partition,
        key: message.key ? message.key.toString() : null,
        value: message.value ? message.value.toString() : null,
        headers: message.headers,
      };
      resultData.push(data);
    },
  });

  await kafka.consumer.seek({
    topic: topic,
    partition: 0,
    offset: 0,
  });
};

init();

router.get("/listtopics", async function (req, res) {
  const topics = await kafka.admin.listTopics();
  res.render("index", {
    title: "Kafka Topics",
    data: JSON.stringify(topics, null, 4),
  });
});

router.get("/", async function (req, res) {
  res.render("index", {
    title: "Apache Kafka",
    data: JSON.stringify(resultData, null, 4),
  });
});

router.post("/send", function (req, res) {
  const topic = req.body.topic ? req.body.topic : "kafka-topic";
  const messages = req.body.messages ? req.body.messages : [];
  kafka
    .send(topic, messages)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

module.exports = router;
