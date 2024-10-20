// Load environment variables
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;


// Route for handling file upload and transcription
app.post('/return_text', async (req, res) => {
  const Groq = require('groq-sdk');

  const groq = new Groq({apiKey: 'key'});
  async function main() {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": ""
        }
      ],
      "model": "llama3-8b-8192",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": true,
      "stop": null
    });
  
    for await (const chunk of chatCompletion) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  }  
});

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Groq Whisper API is ready to transcribe audio!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
