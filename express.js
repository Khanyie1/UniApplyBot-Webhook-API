import express from 'express';
import bodyParser from 'body-parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dialogflowfulfillment = require('dialogflow-fulfillment');

const app = express();
app.use(bodyParser.json());

app.get('/api/webhook/dialogflow/', (req, res) => {
  res.status(200).send('Webhook is active: port 3014');
});

app.post('/api/webhook/dialogflow/', express.json(), (req, res) => {
  const agent = new dialogflowfulfillment.WebhookClient({
    request: req,
    response: res,
  });

  // Middleware to check locale and execute appropriate handler
  function checkLocaleAndExecute(handler) {
    return (agent) => {
      const locale = agent.locale || 'en';
      console.log('Detected language: ', locale);

      const supportedLanguages = ['en', 'zu'];

      if (supportedLanguages.includes(locale)) {
        return handler(agent, locale);
      } else {
        agent.add('Sorry, your language is not supported yet.');
      }
    };
  }

  function uniApplyBotAgent(agent, locale) {
    if (locale === 'en') {
      agent.add('Getting the responses from the webhook in English.');
    } else if (locale === 'zu') {
      agent.add('Sawubona, singakusiza ngani?');
    }
  }

  let intentMap = new Map();
  intentMap.set('greetings', checkLocaleAndExecute(uniApplyBotAgent));

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
