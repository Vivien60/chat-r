// Once the service worker is registered set the initial state
function initialiseState() {
    console.log('initialiseState');
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        console.log('Notifications aren\'t supported.');
        return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');
        return;
    }

    console.log('yoyoyo');
    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                console.log('then then soyons then');
                // Enable any UI which subscribes / unsubscribes from
                // push messages.
                var pushButton = document.querySelector('.js-push-button');
                pushButton.disabled = false;

                if (!subscription) {
                    // We aren't subscribed to push, so set UI
                    // to allow the user to enable push
                    return;
                }

                // Keep your server in sync with the latest subscriptionId
                sendSubscriptionToServer(subscription);

                // Set your UI to show they have subscribed for
                // push messages
                pushButton.textContent = 'Disable Push Messages';
                isPushEnabled = true;
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });
}

function sendSubscriptionToServer(subscription)
{
    console.log(subscription);
}


function notifyMe(message) {

    if (!("Notification" in window)) {
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


function subscribe() {
    // Disable the button so it can't be changed while
    // we process the permission request
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe()
            .then(function(subscription) {
                // The subscription was successful
                isPushEnabled = true;
                pushButton.textContent = 'Disable Push Messages';
                pushButton.disabled = false;

                // TODO: Send the subscription.endpoint to your server
                // and save it to send a push message at a later date
                return sendSubscriptionToServer(subscription);
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    // The user denied the notification permission which
                    // means we failed to subscribe and the user will need
                    // to manually change the notification permission to
                    // subscribe to push messages
                    console.warn('Permission for Notifications was denied');
                    pushButton.disabled = true;
                } else {
                    // A problem occurred with the subscription; common reasons
                    // include network errors, and lacking gcm_sender_id and/or
                    // gcm_user_visible_only in the manifest.
                    console.error('Unable to subscribe to push.', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                }
            });
    });
}
