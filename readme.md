### Prerequisite

Define the deepseek model that you would like to use. The bigger "b", the bigger hardware processing requirement. For starters, try the default (1.5b) to see faster results. 

To set this in this program, please modify the .env file:
```
# https://ollama.com/library/deepseek-r1
DEEPSEEK_R1="deepseek-r1"
DEEPSEEK_R1_VARIANT="1.5b" # 1.5b, 7b, 8b, 14b, 32b, 70b

# New combined variable (format: model:version)
AI_MODEL="${DEEPSEEK_R1}:${DEEPSEEK_R1_VARIANT}"
```

[Deepseek r1 notes](https://ollama.com/library/deepseek-r1)

| Name | Model |
|-------|---------|
| DeepSeek-R1-Distill-Qwen-1.5B | deepseek-r1:1.5b |
| DeepSeek-R1-Distill-Qwen-7B | deepseek-r1:7b |
| DeepSeek-R1-Distill-Llama-8B | deepseek-r1:8b |
| DeepSeek-R1-Distill-Qwen-14B | deepseek-r1:14b |
| DeepSeek-R1-Distill-Qwen-32B | deepseek-r1:32b |
| DeepSeek-R1-Distill-Llama-70B | deepseek-r1:70b |


### 1. Build a docker container that uses Ollama | Deepseek

This will utilize the setup variables in .env

```
$ npm run docker:build
$ npm run docker:up
```

This will take time since for the first try it will download the model. So check the logs when the model gets loaded successfully.

### 2. Run our sample client service to communicate with the ollama server
```
$ npm run start-client-express-server
```

### 3. Check connectivity

### 3.1 Connection:
```
$ curl http://127.0.0.1:11434/api/tags

Should return {"models":[]} if working
```
	

### 3.2 Port Access:
:: Verify port 11434 is listening
```
$ netstat -ano | findstr :11434
```

### 4. Test in the browser
<code>
    http://localhost:3000/
    <br />
    http://127.0.0.1:3000/
</code>