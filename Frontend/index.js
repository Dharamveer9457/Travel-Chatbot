document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    let loaderTimeout; // Variable to track the loader timeout
    hideLoader();
    sendButton.addEventListener('click', function() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        // Add user message to the chat display
        appendMessage('user', userMessage);

        // Show the loader only if the response takes time (e.g., after 2 seconds)
        loaderTimeout = setTimeout(() => {
            showLoader();
        }, 0); // Adjust the delay as needed

        // Send the user message to the Flask backend
        fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'Act as Travel Chatbot...' },
                    { role: 'user', content: userMessage },
                ],
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Cancel the loader timeout (response received)
                clearTimeout(loaderTimeout);
                hideLoader();
                // Add chatbot's response to the chat display
                const chatbotResponse = data.response;
                appendMessage('bot', chatbotResponse);
            })
            .catch((error) => {
                console.error('Error:', error);

                // Hide the loader in case of an error
                hideLoader();
            });

        // Clear the input field
        userInput.value = '';
    });

    function showLoader() {
        // Show the loader while waiting for the response
        const loader = document.createElement('div');
        loader.classList.add('dot-loader');
        chatMessages.appendChild(loader);
    }

    function hideLoader() {
        // Remove the loader from the chat
        const loader = document.querySelector('.dot-loader');
        if (loader) {
            loader.remove();
        }
    }

    function showLoader() {
        // Show the loader while waiting for the response
        const loader = document.createElement('div');
        loader.classList.add('dot-loader');
        chatMessages.appendChild(loader);
    }

    function hideLoader() {
        // Remove the loader from the chat
        const loader = document.querySelector('.dot-loader');
        if (loader) {
            loader.remove();
        }
    }

    function appendMessage(role, content, isLoading) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        
        if (isLoading) {
            messageDiv.classList.add('loading');
        }

        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('message-content');
        messageContentDiv.innerText = content;
        messageDiv.appendChild(messageContentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom to show the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
