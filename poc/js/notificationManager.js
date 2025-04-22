// Once the service worker is registered set the initial state

const pushButton = document.querySelector('.js-push-button');
const unsubscribeButton = document.querySelector('.js-unsubscribe-button');
const notifyMeButton = document.querySelector('.js-notifyme-button');

function notificationTransportSubscriptionStatus()
{
    //WORK IN PROGRESS
    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        const subscribed = serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                return true;
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });

    //END OF WORK IN PROGRESS
}
function initialiseUIState() {
    console.log('initialiseState');
    if(!pushMessagingIsSupported())
    {
        return;
    }

    if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');
        return;
    }

    console.log('yoyoyo');

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                initialiseButtonState(subscription);
                // Keep your server in sync with the latest subscriptionId
                sendSubscriptionToServer(subscription);

            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });
}

function initialiseButtonState(subscription)
{
    const pushButton = document.querySelector('.js-push-button');
    const unsubscribeButton = document.querySelector('.js-unsubscribe-button');
    const notifyMeButton = document.querySelector('.js-notifyme-button');
    console.log('then then soyons then');
    if (!subscription) {
        pushButton.disabled = false;
        unsubscribeButton.disabled = true;
        notifyMeButton.disabled = true;
        return;
    }

    pushButton.disabled = true;
    unsubscribeButton.disabled = false;
    notifyMeButton.disabled = false;
}

async function unsubscribe()
{
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();

    const unsubscribed = await subscription.unsubscribe();
    if (unsubscribed) {
        console.info('Successfully unsubscribed from push notifications.');
        initialiseUIState(subscription);
    }
}


function subscribe() {
    const pushButton = document.querySelector('.js-push-button');
    // Disable the button so it can't be changed while
    // we process the permission request
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe()
            .then(function(subscription) {
                // TODO: Send the subscription.endpoint to your server
                // and save it to send a push message at a later date

                return sendSubscriptionToServer(subscription);
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for Notifications was denied');
                } else {
                    console.error('Unable to subscribe to push.', e);
                }
            })
            .finally(function() {
                initialiseUIState();
            });
    });
}

function notifyMe(message) {

    if (!pushMessagingIsSupported()) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else {
        const title = "doing something";
        const img = "/img/the_shape_of_the_phoenix.png";
        const text = `HEY! Your task "${title}" is now overdue.`;

        if (Notification.permission === "granted") {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            const notification = new Notification("To do list", { body: text, icon: img });
            // …
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                console.log(permission);
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    const notification = new Notification("To do list", { body: text, icon: img });
                    // …
                }
            });
        }
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}

function pushMessagingIsSupported() {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        console.log('Notifications aren\'t supported.');
        return false;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');
        return false;
    }

    return true;
}

function sendSubscriptionToServer(subscription)
{
    console.log(subscription);
}

function unsubscribeOnServer(subscription)
{
    return;
    //TODO :
    fetch('/remove-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({endpoint: subscription.endpoint})
    });
}
