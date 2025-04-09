// Chat.js
// Classe principale du chat, agnostique du mode de transport
export default class ChatUIHandler {
    constructor({messageInput, messagesContainer, sendButton}) {
        this.messageInput = messageInput;
        this.messagesContainer = messagesContainer;
        this.sendButton = sendButton;
    }

    init() {
        this.sendButton.addEventListener('click', () => {
            this.sendMessage(this.messageInput.value);
        })

        this.messageInput.addEventListener("keydown", (e) => {
            if(e.key.toLowerCase() === 'enter') {
                this.sendMessage(this.messageInput.value);
            }
        });
    }

    sendMessage(content) {
        if (!content?.trim()) return;
        const message = {
            content,
            timestamp: new Date().toISOString()
        };
        this.handleMessageSending(message);
    }

    handleMessageSending(message)
    {
        this.displayMessage(message);
        this.clearInput();
    }

    displayMessage(message)
    {
        let div = document.createElement("div");
        div.append(message.content);
        this.messagesContainer.append(div);
    }

    clearInput() {
        this.messageInput.value = '';
    }
}