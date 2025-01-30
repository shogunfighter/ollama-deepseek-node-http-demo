const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({
  path: path.join(__dirname, '.env-local') // Replace with your .env file
});

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.static('public')); // Add this line

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} ${req.path}`);
  if (req.body && req.body.prompt) {
    console.log(`Input Prompt: ${req.body.prompt.substring(0, 80)}${req.body.prompt.length > 80 ? '...' : ''}`);
  }
  next();
});

// Ollama API configuration
console.log(`OLLAMA_HOST:${process.env.OLLAMA_HOST}\nOLLAMA_API_PATH:${process.env.OLLAMA_API_PATH}`);

// curl http://localhost:11434/api/generate -X POST -H "Content-Type: application/json" -d "{\"model\":\"deepseek-r1:1.5b\",\"prompt\":\"Why is the sky blue?\",\"stream\":false,\"temperature\":0.3}"

// Simple test endpoint
app.get('/', (req, res) => {
  res.send('Ollama Server is running');
});

// Main endpoint for streaming interaction
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    console.log("model:",model);
    // Add validation for model parameter
    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }


    const ollamaResponse = await axios.post(`${process.env.OLLAMA_HOST}${process.env.OLLAMA_API_PATH}`, {
      model,
      prompt,
      stream: true,
      temperature: 0.3,
      max_tokens: 2048
    }, { responseType: 'stream' });

    // Pipe Ollama's stream directly to client
    ollamaResponse.data.pipe(res);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: error.response?.data?.error || 'Internal server error' 
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}); 