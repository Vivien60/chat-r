import ChatUIHandler from "./ChatUI.js";
import PushSubscription from "./PushSubscription.js";
import ChatApi from "./ChatApi.js";

initChat(
    conversation.config(),
    pushMessaging.config(),
    await new PushSubscription('/service-worker.js', new ChatApi())
).then(
    function(chat){
    console.log(chat);
});

async function initChat(conversationButtons, notificationsButtons, messagingService = null)
{
    return messagingService.setUp()
        .then(messagingService.syncOnServer.bind(messagingService))
        .then(function() {
            let chat = new ChatUIHandler(conversationButtons, messagingService, notificationsButtons);
            chat.init();
            window.messagingService = messagingService;
            window.chat = chat;
            return chat;
        });
}