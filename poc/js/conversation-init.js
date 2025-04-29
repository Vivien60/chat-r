import ChatUIHandler from "./chatUI.js";
import PushMessaging from "./pushMessaging.js";

const {messageInput, sendButton, messagesContainer} = conversation.config();
let messaging = await new PushMessaging();
let chat = new ChatUIHandler({messageInput, messagesContainer, sendButton}, messaging);
chat.init();
initialiseUIState();
window.addEventListener('load', function() {

    const {pushButton, unsubscribeButton, notifyMeButton} = pushMessaging.config();

    pushButton.addEventListener('click', async function () {
        messaging.disallowSubscriptionByUI();
        let subscribed = messaging.subscribe();
        initialiseUIState(subscribed);
    });
    unsubscribeButton.addEventListener('click', function () {
        messaging.disallowSubscriptionByUI();
        messaging.unsubscribe().then(function(success){
            initialiseUIState(!success);
        });
    });
    notifyMeButton.addEventListener('click', function () {
        messaging.notifyMe({});
    });


});

function initialiseUIState(subscriptionIsActive = false) {
    initialiseButtonState(subscriptionIsActive);
    // Keep your server in sync with the latest subscriptionId
}

function initialiseButtonState(subscriptionIsActive)
{
    console.log('initialiseButtonState', subscriptionIsActive);
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