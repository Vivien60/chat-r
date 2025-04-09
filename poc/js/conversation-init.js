document.addEventListener('DOMContentLoaded', function() {
    const {messageInput, sendButton, messagesContainer} = conversation.config();
    initChat(messageInput, messagesContainer, sendButton);
});