document.addEventListener('DOMContentLoaded', function() {
    const {messageInput, sendButton, messagesContainer} = conversation.config();
    sendButton.addEventListener('click', () => {
        addNewMessageToChat(messageInput.value, messagesContainer)
            .then(() => {
                messageInput.value = ''
            }
        );
    })
});