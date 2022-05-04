var express = require("express");
var router = express.Router();
var kafka = require("../kafka");

router.get("/", async function (req, res) {
  res.render("index", {
    title: "Apache Kafka Socket.IO",
    data: "",
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
