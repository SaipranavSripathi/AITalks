// Check for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

let isListening = false;

// Start conversation button listener
document.getElementById('startConversationBtn').addEventListener('click', startConversation);

// Voice recognition buttons (disabled initially)
document.getElementById('startVoiceBtn').addEventListener('click', startListening);
document.getElementById('stopVoiceBtn').addEventListener('click', stopListening);


// Starts the conversation after user provides a scenario
async function startConversation() {
    const scenario = document.getElementById('scenario').value;
    const intro = new SpeechSynthesisUtterance('Lets begin our conversation on '+scenario);
    window.speechSynthesis.speak(intro);
    if (!scenario) {
        document.getElementById('feedback').innerHTML = "Please enter a scenario to start the conversation.";
        return;
    }

    document.getElementById('feedback').innerHTML = `Scenario set: ${scenario}`;
    document.getElementById('conversation').disabled = false;
    document.getElementById('startVoiceBtn').disabled = false;
    document.getElementById('stopVoiceBtn').disabled = false;

    // Simulate initial greeting after the user sets a scenario
    const greeting = `Good day! Let's begin our discussion about "${scenario}". You can start whenever you're ready.`;
    document.getElementById('feedback').innerHTML += `<br>${greeting}`;
}

// Start voice recognition
function startListening() {
    if (isListening) return; // Avoid starting new session if already listening
    recognition.start();
    isListening = true;
    document.getElementById('status').innerHTML = "Listening..."; // Update status
}

// Stop voice recognition
function stopListening() {
    recognition.stop();
    isListening = false;
    document.getElementById('status').innerHTML = "Stopped listening."; // Update status
}

// Handle recognized speech
recognition.addEventListener('result', async (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    // Check if the last result is final
    if (event.results[event.results.length - 1].isFinal) {
        // Update conversation textarea with the spoken text
        document.getElementById('conversation').value = transcript;
        await sendMessage(transcript);
    }
});

// Function to send the message and get a response from an external API
async function sendMessage(message) {
    console.log("Sent to API");
    const scenario = document.getElementById('scenario').value;
    const feedback = document.getElementById('feedback');

    if (!scenario || !message ) {
        feedback.innerHTML = "Please provide scenario, message, and upload an audio file.";
        return;
    }
    try {
        const response = await fetch(endpoint, {
            method: 'POST', // or 'GET', depending on the API
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "temperature": 0,
                "model_name": "mixtral-8x7b-32768",
                // Add any additional parameters you need to pass in the request
            })
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Groq API response:', data);
    } catch (error) {
        console.error('Error calling Groq API:', error);
    }

    // const Groq = require('groq-sdk');

    // const groq = new Groq();
    // async function main() {
    //   const chatCompletion = await groq.chat.completions.create({
    //     "messages": [
    //       {
    //         "role": "user",
    //         "content": ""
    //       }
    //     ],
    //     "model": "llama3-8b-8192",
    //     "temperature": 1,
    //     "max_tokens": 1024,
    //     "top_p": 1,
    //     "stream": true,
    //     "stop": null
    //   });
    
    //   for await (const chunk of chatCompletion) {
    //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
    //   }
    // }
    
    // const formData = new FormData();
    // formData.append('message', message);
    // formData.append('model','distil-whisper-large-v3-en')
    // formData.append('scenario', scenario);
    // console.log(message)
    // try {
    //     // Replace the URL with the actual API endpoint provided by Fetch.ai
    //     const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', { 
    //         method: 'POST',
    //         body: formData,
    //         headers: {
    //             'Authorization': 'Bearer ', // Your API key
    //             'model': 'distil-whisper-large-v3-en'
    //             // Let the browser automatically handle formData headers
    //         },
    //     });

    //     if (!response.ok) {
    //         throw new Error('Failed to fetch response , could you try again');
    //     }

    //     const data = await response.json();

    //     // Display the AI response
    //     feedback.innerHTML = `Response: ${data.transcription || "Can you please repeat the sentence!"}`;

    //     // Speak the response out loud
    //     const utterance = new SpeechSynthesisUtterance(data.transcription);
    //     window.speechSynthesis.speak(utterance);

    // } catch (error) {
    //     feedback.innerHTML = `Error: ${error.message}`;
    //     console.error('Error:', error);
    // }
}
