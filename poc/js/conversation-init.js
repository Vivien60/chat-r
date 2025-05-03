import ChatUIHandler from "./ChatUI.js";
import PushMessaging from "./PushMessaging.js";

initChat(conversation.config(), pushMessaging.config()).then(console.log);
async function initChat({messageInput, messagesContainer, sendButton}, {pushButton, unsubscribeButton, notifyMeButton})
{
    let messaging = new PushMessaging();
    return await messaging.setUp()
        .then(messaging.syncOnServer.bind(messaging))
        .then(function() {
            let chat = new ChatUIHandler({messageInput, messagesContainer, sendButton}, messaging, {pushButton, unsubscribeButton, notifyMeButton});
            chat.init();
            return chat;
        });
}