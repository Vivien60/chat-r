import ChatUIHandler from "./ChatUI.js";
import PushMessaging from "./PushMessaging.js";

const {messageInput, sendButton, messagesContainer} = conversation.config();
let messaging = new PushMessaging();
let chat = await messaging.setUp()
    .then(messaging.syncOnServer.bind(messaging))
    .then(function() {
        let chat = new ChatUIHandler({messageInput, messagesContainer, sendButton}, messaging);
        chat.init();
        return chat;
    });
const {pushButton, unsubscribeButton, notifyMeButton} = pushMessaging.config();

pushButton.addEventListener('click', async function (   ) {
    chat.disallowSubscriptionByUI();
    let subscribed = messaging.subscribe();
    chat.actualizeButtonState(subscribed);
});
unsubscribeButton.addEventListener('click', function () {
    chat.disallowSubscriptionByUI();
    messaging.unsubscribe().then(function(success){
        chat.actualizeButtonState(!success);
    });
});
notifyMeButton.addEventListener('click', function () {
    messaging.notifyMe({});
});

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