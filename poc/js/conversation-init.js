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
            .then(function(success) {
                actualizePushNotifierStatus().then(initialiseUIState);

            });
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }

    pushButton.addEventListener('click', async function () {
        disallowSubscriptionByUI();
        subscribe().then(initialiseUIState);
    });
    unsubscribeButton.addEventListener('click', function () {
        disallowSubscriptionByUI();
        unsubscribe().then(function(success){
            initialiseUIState(!success);
        });
    });
    notifyMeButton.addEventListener('click', function () {
        notifyMe({});
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