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
        this.subscriptionIsActive = false;
        this.notificationsAreAllowed = false;
    }

    init() {
        this.syncWithSubscriptionStatus();
        this.addEventsListeners();
    }

    addEventsListeners() {
        this.sendButton.addEventListener('click', this.doSendingProcess.bind(this));
        this.messageInput.addEventListener("keydown", this.doSendingProcessIfGoodKeyIsDown.bind(this));
        this.pushButton.addEventListener('click', this.doSubscriptionProcess.bind(this));
        this.unsubscribeButton.addEventListener('click', this.doUnsubscriptionProcess.bind(this));
        this.notifyMeButton.addEventListener('click', this.doNotifyMeProcess.bind(this));
    }

    doSendingProcessIfGoodKeyIsDown(e) {
        if (e.key.toLowerCase() === 'enter') {
            this.doSendingProcess();
        }
    }

    doSendingProcess() {
        let content = this.messageInput.value;
        if (!content?.trim()) return;
        const message = this.textToMessage(content);
        this.handleMessageSending(message);
    }

    textToMessage(content) {
        return {
            text: content,
            timestamp: new Date().toISOString()
        };
    }

    handleMessageSending(message)
    {
        this.displayMessage(message);
        this.doNotifyMeProcess();
        this.clearInput();
    }

    displayMessage(message)
    {
        let div = document.createElement("div");
        div.append(message.text);
        this.messagesContainer.append(div);
    }

    clearInput() {
        this.messageInput.value = '';
    }

    doSubscriptionProcess() {
        this.disallowSubscriptionByUI();
        this.subscriptionIsActive = !!this.transportService.subscribe();
        this.syncWithSubscriptionStatus();
    }

    doUnsubscriptionProcess() {
        this.disallowSubscriptionByUI();
        this.transportService.unsubscribe().then(function (success) {
            this.subscriptionIsActive = !success
            this.syncWithSubscriptionStatus();
        }.bind(this));
    }

    disallowSubscriptionByUI() {
        // Disable the button so it can't be changed while
        // we process the permission request
        this.pushButton.disabled = true;
    }

    syncWithSubscriptionStatus()
    {
        if (!this.subscriptionIsActive) {
            this.pushButton.disabled = false;
            this.unsubscribeButton.disabled = true;
            this.notifyMeButton.disabled = true;
            return;
        }

        this.pushButton.disabled = true;
        this.unsubscribeButton.disabled = false;
        this.notifyMeButton.disabled = false;
    }

    doNotifyMeProcess(){
        const title = "doing something";
        const img = "/img/the_shape_of_the_phoenix.png";
        const text = this.messageInput.value;
        try {
            this.transportService.notify(text, {title, img});
        }
        catch (e) {
            console.warn("This browser does not support desktop notification");
            this.notificationsAreAllowed = false;
            return;
        }
        this.notificationsAreAllowed = true;
    }
}