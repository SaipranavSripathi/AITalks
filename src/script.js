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

    // Update conversation textarea with the spoken text
    document.getElementById('conversation').value = transcript;

    // If the user stops speaking, automatically send the message
    if (event.results[0].isFinal) {
        await sendMessage(transcript);
    }
});

// Function to send the message and get a response from Fetch.ai
async function sendMessage(message) {
    const scenario = document.getElementById('scenario').value;
    const feedback = document.getElementById('feedback');

    if (!scenario || !message) {
        feedback.innerHTML = "Please provide both scenario and message.";
        return;
    }

    // Fetch response from Fetch.ai endpoint
    // const response = await fetch('YOUR_FETCHAI_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ message, scenario }),
    // });

    //const data = await response.json();

    // Display the AI response
    data='Hello how are you?'
    feedback.innerHTML = `Response: ${data || "No response found."}`;

    const utterance = new SpeechSynthesisUtterance(data);
    window.speechSynthesis.speak(utterance);
}
