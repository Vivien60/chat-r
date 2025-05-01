// Chat.js
// Classe principale du chat, agnostique du mode de transport
export default class ChatUIHandler {
    constructor({messageInput, messagesContainer, sendButton}, transportService) {
        this.messageInput = messageInput;
        this.messagesContainer = messagesContainer;
        this.sendButton = sendButton;
    }

    init() {
        this.actualizeButtonState();
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

    actualizeButtonState(subscriptionIsActive)
    {
        const subscribeToPushButton = document.querySelector('.js-push-button');
        const unsubscribeButton = document.querySelector('.js-unsubscribe-button');
        const notifyMeButton = document.querySelector('.js-notifyme-button');

        if (!subscriptionIsActive) {
            subscribeToPushButton.disabled = false;
            unsubscribeButton.disabled = true;
            notifyMeButton.disabled = true;
            return;
        }

        subscribeToPushButton.disabled = true;
        unsubscribeButton.disabled = false;
        notifyMeButton.disabled = false;
    }

    disallowSubscriptionByUI() {
        const pushButton = document.querySelector('.js-push-button');
        // Disable the button so it can't be changed while
        // we process the permission request
        pushButton.disabled = true;
    }
}