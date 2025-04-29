// Classe principale du chat, agnostique du mode de transport
export default class PushMessaging {

    constructor() {
        this.setPushSubscriptionFromBrowser();
        // Check that service workers are supported, if so, progressively
        // enhance and add push messaging support, otherwise continue without it.
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(this.actualizePushNotifierStatus.bind(this));
        } else {
            console.warn('Service workers aren\'t supported in this browser.');
        }
    }

    subscribe() {
        this.makeSubscription().then(this.sendSubscriptionToServer.bind(this));

        return this.subscription;
    }

    makeSubscription() {
        return this.pushServiceIsReady()
            .then(this.pushServiceSubscribe.bind(this))
            .catch(this.displaySubscriptionError);
    }

    pushServiceIsReady() {
        return navigator.serviceWorker.ready;
    }

    async pushServiceSubscribe(serviceWorkerRegistration) {
        this.subscription = await serviceWorkerRegistration.pushManager.subscribe()
    }

    displaySubscriptionError(e) {
        console.error('Unable to subscribe to push.', e);
        return null;
    }

    sendSubscriptionToServer() {
        // TODO: Send the subscription.endpoint to your server
        // and save it to send a push message at a later date
        console.log('aaa', this.subscription);
        return;
        //TODO :
        fetch('/register-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({endpoint: this.subscription.endpoint})
        });
    }

    async unsubscribe() {
        return this.subscription.unsubscribe();
    }

    async setPushSubscriptionFromBrowser() {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        this.subscription = subscription;
        return subscription;
    }

    unsubscribeOnServer() {
        return;
        //TODO :
        fetch('/remove-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({endpoint: this.subscription.endpoint})
        });
    }

    async actualizePushNotifierStatus() {
        if (!this.canUseNotificationPush()) {
            return;
        }

        const subscription = await this.setPushSubscriptionFromBrowser();
        this.actualizePushState(subscription);
        return subscription;
    }

    canUseNotificationPush() {
        if (this.notificationsAreSupported() && this.pushServiceIsSupported()) {
            return !this.notificationsAreDisallowedByUser();
        }
        return false;
    }

    notificationsAreSupported() {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notifications aren\'t supported.');
            console.log('Notifications aren\'t supported.');
            return false;
        }
        return true;
    }

    pushServiceIsSupported() {
        if (!('PushManager' in window)) {
            console.log('Push messaging isn\'t supported.');
            return false;
        }
        return true;
    }

    notificationsAreDisallowedByUser() {
        if (Notification.permission === 'denied') {
            console.warn('The user has blocked notifications.');
            console.log('The user has blocked notifications.');
            return true;
        }
        return false;
    }

    actualizePushState() {
        this.sendSubscriptionToServer();
    }

    notifyMe(message) {

        if (!this.notificationsAreSupported()) {
            // Check if the browser supports notifications
            console.warn("This browser does not support desktop notification");
        } else {
            const title = "doing something";
            const img = "/img/the_shape_of_the_phoenix.png";
            const text = `HEY! Your task "${title}" is now overdue.`;

            if (Notification.permission === "granted") {
                // Check whether notification permissions have already been granted;
                // if so, create a notification
                const notification = new Notification("To do list", {body: text, icon: img});
                // …
            } else if (Notification.permission !== "denied") {
                // We need to ask the user for permission
                Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        const notification = new Notification("To do list", {body: text, icon: img});
                        // …
                    }
                });
            }
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
    }

    disallowSubscriptionByUI() {
        const pushButton = document.querySelector('.js-push-button');
        // Disable the button so it can't be changed while
        // we process the permission request
        pushButton.disabled = true;
    }
}
