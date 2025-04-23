import ChatUIHandler from "./chatUI.js";

const {messageInput, sendButton, messagesContainer} = conversation.config();
let chat = new ChatUIHandler({messageInput, messagesContainer, sendButton});
chat.init();

window.addEventListener('load', function() {

    const {pushButton, unsubscribeButton, notifyMeButton} = pushMessaging.config();
    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(initialiseUIState);
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }

    pushButton.addEventListener('click', function () {
        subscribe();
    });
    unsubscribeButton.addEventListener('click', function () {
        unsubscribe();
    });
    notifyMeButton.addEventListener('click', function () {
        notifyMe({});
    });
});