// Chat.js
// Classe principale du chat, agnostique du mode de transport
export default class ChatUIHandler {
    constructor({messageInput, messagesContainer, sendButton}, messagingService, {pushButton, unsubscribeButton, notifyMeButton}) {
        this.messageInput = messageInput;
        this.messagesContainer = messagesContainer;
        this.sendButton = sendButton;
        this.messagingService = messagingService;
        this.pushButton = pushButton;
        this.unsubscribeButton = unsubscribeButton;
        this.notifyMeButton = notifyMeButton;
        this.subscriptionIsActive = !!messagingService.subscription;
        this.notificationsAreAllowed = !!messagingService.subscription;
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
        this.notifyMeButton.addEventListener('click', this.doSendingProcess.bind(this));
    }

    doSendingProcessIfGoodKeyIsDown(e) {
        if (e.key.toLowerCase() === 'enter') {
            this.doSendingProcess();
        }
    }

    doSendingProcess() {
        let message = this.messageInput.value;
        if (!message?.trim()) return;
        this.handleMessageSending(message);
    }

    handleMessageSending(message)
    {
        this.displayMessage(message);
        this.sendMessageRequest(message);
        this.clearInput();
    }

    displayMessage(message)
    {
        let div = document.createElement("div");
        div.append(message);
        this.messagesContainer.append(div);
    }

    clearInput() {
        this.messageInput.value = '';
    }

    doSubscriptionProcess() {
        this.disallowSubscriptionByUI();
        this.subscriptionIsActive = !!this.messagingService.subscribe();
        this.syncWithSubscriptionStatus();
    }

    doUnsubscriptionProcess() {
        this.disallowSubscriptionByUI();
        this.messagingService.unsubscribe().then(function (success) {
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

    sendMessageRequest(message){
        const title = "doing something";
        const img = "/img/the_shape_of_the_phoenix.png";
        try {
            this.messagingService.send(message, {title, img});
        }
        catch (e) {
            console.warn("This browser does not support desktop notification");
            this.notificationsAreAllowed = false;
            return;
        }
        this.notificationsAreAllowed = true;
    }
}