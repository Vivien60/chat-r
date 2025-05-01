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