#!/bin/sh
set -ex

# Load environment variables using POSIX-compliant method
# . /usr/local/bin/.env  # Now using absolute path

# Extract model name and version
MODEL_NAME=$(echo "$AI_MODEL" | cut -d':' -f1)
MODEL_VERSION=$(echo "$AI_MODEL" | cut -d':' -f2)

# Start Ollama in background
# ollama serve
ollama serve & ollama pull "$MODEL_NAME:$MODEL_VERSION";

# until curl -sSf http://localhost:11434/api/tags >/dev/null 2>&1; do
#   echo "Waiting for Ollama API..."
#   sleep 3
# done


# # Pull model if missing (with retries)
# if ! ollama list | grep -q "$MODEL_NAME:$MODEL_VERSION"; then
#   echo "Pulling $AI_MODEL..."
#   for i in 1 2 3 4 5; do
#     if ollama pull "$MODEL_NAME:$MODEL_VERSION"; then
#       break
#     fi
#     echo "Attempt $i failed, retrying..."
#     sleep $((i*5))
#   done
# fi

# Keep container alive
tail -f /dev/null