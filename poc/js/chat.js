function initChat( messageInput, chatContainer, sendButton)
{
    sendButton.addEventListener('click', () => {
        sendMessage(messageInput, chatContainer);
    })

    messageInput.addEventListener("keydown", (e) => {
        if(e.key.toLowerCase() === 'enter') {
            sendMessage(messageInput, chatContainer);
        }
    });
}

function sendMessage(messageInput, messagesContainer) {
    copyMessageToChat(messageInput.value, messagesContainer);
    clearInput(messageInput);
}

function copyMessageToChat(message, messagesContainer)
{
    let div = document.createElement("div");
    div.append(message);
    messagesContainer.append(div);
}

function clearInput(messageInput) {
    messageInput.value = '';
}