### 1. Install the ollama app - think of it as a server to process the model 
https://ollama.com/download

### 2. Let's pick a model (DeepSeek is shiny new :D) 
- think of this as the AI model/brain to process queries with AI answers 

https://ollama.com/library/deepseek-r1

Pick any below depending on your CPU/GPU. The bigger "B", the bigger hardware processing requirement. For starters, try the first to see faster results.

- DeepSeek-R1-Distill-Qwen-1.5B 
<code>$ ollama run deepseek-r1:1.5b</code>

- DeepSeek-R1-Distill-Qwen-7B
<code>$ ollama run deepseek-r1:7b</code>

- DeepSeek-R1-Distill-Llama-8B
<code>$ ollama run deepseek-r1:8b</code>

- DeepSeek-R1-Distill-Qwen-14B
<code>$ ollama run deepseek-r1:14b</code>

- DeepSeek-R1-Distill-Qwen-32B
<code>$ ollama run deepseek-r1:32b</code>

- DeepSeek-R1-Distill-Llama-70B
<code>$ ollama run deepseek-r1:70b</code>

Run the ollama application. This runs at default port=11434;
Once ollama with the deepseek r1 model of your choice is running...

### 3.1 Test Connection:

<code>$ curl http://127.0.0.1:11434/api/tags</code>
	
#### Should return {"models":[]} if working

### 3.2 Check Port Access:

:: Verify port 11434 is listening

<code>$ netstat -ano | findstr :11434</code>

### 3.3 Let's check the source coude environment variables (usually .env file)

### 4. Run our service. A simple HTTP service that send/receive data to our ollama application. This service has a UI for the chat. Simple stuff.
    
<code>$ npm start</code>

### 5. Open browser: 

<code>
    http://localhost:3000/
    <br />
    http://127.0.0.1:3000/
</code>


----