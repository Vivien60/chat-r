// Chat.js
// Classe principale du chat, agnostique du mode de transport
export default class ChatUIHandler {
    constructor({messageInput, messagesContainer, sendButton}, transportService, {pushButton, unsubscribeButton, notifyMeButton}) {
        this.messageInput = messageInput;
        this.messagesContainer = messagesContainer;
        this.sendButton = sendButton;
        this.transportService = transportService;
        this.pushButton = pushButton;
        this.unsubscribeButton = unsubscribeButton;
        this.notifyMeButton = notifyMeButton;
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
        this.pushButton.addEventListener('click', async function (   ) {
            this.disallowSubscriptionByUI();
            let subscribed = this.transportService.subscribe();
            this.actualizeButtonState(subscribed);
        }.bind(this));
        this.unsubscribeButton.addEventListener('click', function () {
            this.disallowSubscriptionByUI();
            this.transportService.unsubscribe().then(function(success){
                this.actualizeButtonState(!success);
            }.bind(this));
        }.bind(this));
        this.notifyMeButton.addEventListener('click', function () {
            this.notifyMe({});
        }.bind(this));
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
        if (!subscriptionIsActive) {
            this.pushButton.disabled = false;
            this.unsubscribeButton.disabled = true;
            this.notifyMeButton.disabled = true;
            return;
        }

        this.pushButton.disabled = true;
        this.unsubscribeButton.disabled = false;
        this.notifyMeButton.disabled = false;
    }

    disallowSubscriptionByUI() {
        // Disable the button so it can't be changed while
        // we process the permission request
        this.pushButton.disabled = true;
    }

    notifyMe( message ){
        const title = "doing something";
        const img = "/img/the_shape_of_the_phoenix.png";
        const text = `HEY! Your task "${title}" is now overdue.`;
        this.transportService.notifyMe(text, {title, img});
    }
}