        let eventSource;

        function processContent(text) {
            // Preserve LaTeX blocks before Markdown parsing
            const withLatex = text
                .replace(/\$\$(.*?)\$\$/gs, (_, math) => `<div class="math-display">${math}</div>`)
                .replace(/\$(.*?)\$/g, (_, math) => `<span class="math-inline">${math}</span>`);

            // Convert Markdown to HTML
            const html = marked.parse(withLatex);
            
            return html;
        }

        function appendResponse(text, role = 'ai') {
            const responseDiv = document.getElementById('response-container');
            let element;
            
            if (role === 'ai') {
                element = document.createElement('div');
                element.className = 'response ai-message';
                element.innerHTML = processContent(text);
                responseDiv.appendChild(element);
            } 
            else if (role === 'user') {
                element = document.createElement('div');
                element.className = 'response user-message';
                element.textContent = text;
                responseDiv.appendChild(element);
            }
            
            // Process math and syntax highlighting
            if (element && role === 'ai') {
                if (MathJax.typesetPromise) {
                    MathJax.typesetPromise([element]).then(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    });
                }
                hljs.highlightAll();
            }
            
            responseDiv.scrollTop = responseDiv.scrollHeight;
            return element; // Return the created element
        }

        function sendPrompt() {
            const prompt = document.getElementById('prompt-input').value;
            if (!prompt) return;

            // Create user message and get reference
            const userElement = appendResponse(prompt, 'user');
            
            // Create AI response container
            const aiElement = appendResponse('', 'ai');
            aiElement.id = `answer-${Date.now()}`;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('prompt-input').value = '';
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    model: 'deepseek-r1:1.5b'
                })
            };

            let fullResponse = '';

            fetch('/api/generate', requestOptions)
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    
                    const readChunk = () => {
                        reader.read().then(({ value, done }) => {
                            if (done) {
                                document.getElementById('loading').style.display = 'none';
                                // Process the final response with Markdown/LaTeX
                                aiElement.innerHTML = processContent(fullResponse);
                                if (MathJax.typesetPromise) {
                                    MathJax.typesetPromise([aiElement]);
                                }
                                hljs.highlightAll();
                                return;
                            }
                            
                            const chunk = decoder.decode(value);
                            try {
                                const data = JSON.parse(chunk);
                                if (data.response) {
                                    // Append to buffer, replace newlines with spaces
                                    fullResponse += data.response.replace(/\n/g, ' ');
                                    // Update the AI element
                                    aiElement.textContent = fullResponse;
                                }
                            } catch(e) {
                                console.error('Error parsing chunk:', e);
                            }
                            readChunk();
                        });
                    };
                    
                    readChunk();
                })
                .catch(err => {
                    console.error('Request failed:', err);
                    document.getElementById('loading').style.display = 'none';
                });
        }

        function clearChat() {
            document.getElementById('response-container').innerHTML = '';
            if (eventSource) eventSource.close();
            document.getElementById('loading').style.display = 'none';
        }

        // Handle Enter key
        document.getElementById('prompt-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendPrompt();
        });

        // Update the marked configuration
        marked.setOptions({
            breaks: true,
            gfm: true,  // Enable GitHub Flavored Markdown
            tables: true,
            highlight: function(code, lang) {
                return hljs.highlightAuto(code).value;
            }
        });