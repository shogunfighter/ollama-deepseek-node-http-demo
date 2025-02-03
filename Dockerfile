FROM ollama/ollama:latest

# Copy files with explicit permissions
COPY init-ollama.sh .env /usr/local/bin/
RUN chmod 755 /usr/local/bin/init-ollama.sh && \
    chmod 644 /usr/local/bin/.env

# Use ENTRYPOINT for initialization
ENTRYPOINT ["/usr/local/bin/init-ollama.sh"]