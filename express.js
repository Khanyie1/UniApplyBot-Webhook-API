import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

// Google Translate API key and endpoint
const googleTranslateAPIKey = '4a003cec64msh637ccde1edc67b8p14b3e3jsnc491a9d60cc6'; // Replace with your API key
const googleTranslateURL = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';

app.post('/api/webhook/', async (req, res) => {
  try {
    const userInput = req.body.queryResult.queryText;

    // Detect language using Google Translate API
    const response = await axios.post(googleTranslateURL, {
      from: 'auto',
      to: 'en',
      text: userInput
    }, {
      headers: {
        'X-RapidAPI-Key': googleTranslateAPIKey,
        'Content-Type': 'application/json'
      }
    });

    const detectedLanguage = response.data.source_language_code;

    // Map language codes to Dialogflow supported languages
    const supportedLanguages = {
      'en': 'English',
      'zu': 'Zulu',
      'se': 'Sesotho',
      'xh': 'Xhosa'
    };

    const language = supportedLanguages[detectedLanguage] || "Unsupported";

    // Respond based on detected language
    res.json({
      fulfillmentText: `Detected language: ${language}.`
    });
  } catch (error) {
    console.error('Error detecting language:', error);
    res.json({
      fulfillmentText: "There was an error processing your request."
    });
  }
});

const PORT = process.env.PORT || 3014;

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
