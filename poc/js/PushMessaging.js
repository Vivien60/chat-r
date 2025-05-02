// Transport de messages
export default class PushMessaging {

    constructor() {

    }

    async setUp() {
        if (!this.canUseNotificationPush()) {
            this.subscription = null;
            return;
        }
        await this.registerServiceWorker();
        this.subscription = await this.syncStatusWithBrowserSubscription();
    }

    registerServiceWorker() {
        return navigator.serviceWorker.register('/service-worker.js');
    }

    syncOnServer() {
        this.sendSubscriptionToServer();
    }

    async actualizePushNotifierStatus() {
        if (!this.canUseNotificationPush()) {
            return;
        }
        await this.registerServiceWorker();
        const subscription = await this.syncStatusWithBrowserSubscription();
        return subscription;
    }

    async syncStatusWithBrowserSubscription() {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        this.subscription = subscription;
        return subscription;
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
        if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
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



    notifyMe(message, notificationOptions) {

        if (!this.notificationsAreSupported()) {
            // Check if the browser supports notifications
            console.warn("This browser does not support desktop notification");
        } else {
            if (Notification.permission === "granted") {
                // Check whether notification permissions have already been granted;
                // if so, create a notification
                const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
                // …
            } else if (Notification.permission !== "denied") {
                // We need to ask the user for permission
                Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
                        // …
                    }
                });
            }
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
    }
}
