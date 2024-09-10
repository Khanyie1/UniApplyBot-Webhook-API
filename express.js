import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dialogflowfulfillment = require('dialogflow-fulfillment');

const app = express();
app.use(bodyParser.json());

app.get('/api/webhook/dialogflow/', (req, res) => {
  res.status(200).send('I have tried again : port 3014')
})

app.post('/api/webhook/dialogflow/', express.json(), (req, res) => {
  const agent = new dialogflowfulfillment.WebhookClient({
    request: req,
    response: res
  });


  // if(locale == "en"){
  //   agent.add(`Good day, how are you?`)
  // } else if (locale == "zulu"){
  //   agent.add(`Sawubona singakusiza ngani`)
  // }

  function uniApplyBotAgent(agent) {
    agent.add("Getting the responses from the webhook");
  }

  var intentMap = new Map();

  intentMap.set('greetings', uniApplyBotAgent)

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3014;

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
