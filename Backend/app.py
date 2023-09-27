from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)

# Enable CORS for specific origins (replace with your frontend domains)
CORS(app, resources={r"/chat": {"origins": ["http://127.0.0.1:5500"]}})

# Initialize the OpenAI API client
openai.api_key = "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"

@app.route('/chat', methods=['POST'])
def chatbot():
    try:
        data = request.json
        messages = data['messages']

        user_message = messages[-1]['content'].lower()
        is_travel_related = any(keyword in user_message for keyword in ['travel', 'trip', 'vacation', 'hotel', 'destination', 'places', 'go'])

        is_greeting = any(greeting in user_message for greeting in ['hii', 'hello', 'namaste', 'hey'])

        is_wellness_question = any(question in user_message for question in ['how are you', 'how\'s you'])

        if is_travel_related:
            # If it's a traveling-related question, proceed with the chatbot response
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=1,
                max_tokens=256,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                # stop=["\n"]
            )
            assistant_reply = response.choices[0].message['content']

        elif is_greeting:
            assistant_reply = "Hello, I am your Travel-Assistant. How can I help you today?"

        elif is_wellness_question:
            assistant_reply = "I am good. Thanks for asking. How can I help you today?"

        else:
            # If it's not a traveling-related question, provide a specific response
            assistant_reply = "I am Travel Chatbot and designed to answer questions related to travelling only."

        return jsonify({'response': assistant_reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
