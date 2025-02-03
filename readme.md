# DeepSeek-R1 Ollama Deployment Guide

## Prerequisites

### Model Configuration
Configure your desired model in `.env` (make a copy from `.env-local` if you don't have it yet):
```env
# Model selection (choose one variant)
DEEPSEEK_R1="deepseek-r1"
DEEPSEEK_R1_VARIANT="1.5b"  # Options: 1.5b, 7b, 8b, 14b, 32b, 70b

# Combined model identifier
AI_MODEL="${DEEPSEEK_R1}:${DEEPSEEK_R1_VARIANT}"
```

**Model Selection Guide**:
- Smaller models (1.5b-7b): Faster response, lower hardware requirements
- Larger models (14b-70b): Better accuracy, requires more resources

| Model Name                          | Ollama Tag           | Recommended VRAM |
|-------------------------------------|----------------------|-------------------|
| DeepSeek-R1-Distill-Qwen-1.5B       | `deepseek-r1:1.5b`   | 4GB+             |
| DeepSeek-R1-Distill-Qwen-7B         | `deepseek-r1:7b`     | 8GB+             |
| DeepSeek-R1-Distill-Llama-8B        | `deepseek-r1:8b`     | 10GB+            |
| DeepSeek-R1-Distill-Qwen-14B        | `deepseek-r1:14b`    | 16GB+            |
| DeepSeek-R1-Distill-Qwen-32B        | `deepseek-r1:32b`    | 24GB+            |
| DeepSeek-R1-Distill-Llama-70B       | `deepseek-r1:70b`    | 48GB+            |

[Model Details](https://ollama.com/library/deepseek-r1)

## Deployment Steps

### 1. Container Setup
```bash
# Rebuild and start containers
npm run docker:reset

# Monitor initialization (wait for model download)
docker logs -f ollama
```

### 2. Client Service
```bash
# Start Express client
npm run start-client-express-server
```

## Verification

### Service Connectivity
```bash
# Check Ollama API
curl http://localhost:11434/api/tags
# Expected: {"models":[{"name":"deepseek-r1:1.5b", ...}]}

# Verify port listening
netstat -ano | findstr :11434  # Windows
lsof -i :11434                 # Linux/macOS
```

### Browser Access
Test endpoints in your browser:
- Ollama API: `http://localhost:11434`
- Client UI: `http://localhost:3000`

## Troubleshooting

### Common Issues
1. **Model Download Failures**:
   ```bash
   # Manual model pull
   docker exec ollama ollama pull deepseek-r1:1.5b
   ```
   
2. **Port Conflicts**:
   ```bash
   # Check running services
   sudo lsof -i :11434
   ```

3. **Hardware Limitations**:
   - Start with smaller models (1.5b/7b)
   - Ensure adequate GPU memory