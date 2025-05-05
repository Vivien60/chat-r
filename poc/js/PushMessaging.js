// Transport de messages
export default class PushMessaging {

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.serviceWorkerFile = serviceWorkerFile;
        this.subscription = null;
    }

    async setUp() {
        if (!this.canUseNotificationPush()) {
            this.subscription = null;
            return;
        }
        await this.#registerServiceWorker(this.serviceWorkerFile);
        this.subscription = await this.#initWithClientSubscription();
    }

    async notify(message, notificationOptions) {
        if (!this.#notificationsAreSupported()) {
            // Check if the browser supports notifications
            throw new Error("This browser does not support desktop notification");
        } else if(await this.#requestNotificationPermission()) {
            const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
        } else {
            throw new Error("Notifications have not been granted by the user");
        }
    }

    subscribe() {
        this.#makeSubscription().then(this.#sendSubscriptionToServer.bind(this));
        return this.subscription;
    }

    async unsubscribe() {
        return this.subscription.unsubscribe().then(this.#unsubscribeOnServer.bind(this));
    }

    syncOnServer() {
        if(this.subscription)
            this.#sendSubscriptionToServer();
    }

    canUseNotificationPush() {
        if (this.#notificationsAreSupported() && this.#pushServiceIsSupported()) {
            return Notification.permission === "granted";
        }
        return false;
    }

    async #initWithClientSubscription() {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        this.subscription = subscription;
        return subscription;
    }

    #makeSubscription() {
        return this.#serviceWorkerRegistration()
            .then(this.#pushServiceSubscribe.bind(this))
            .catch(error => Promise.reject(new Error("Unable to subscribe to push.")));
    }

    async #pushServiceSubscribe(serviceWorkerRegistration) {
        this.subscription = await serviceWorkerRegistration.pushManager.subscribe()
    }

    async #requestNotificationPermission() {
        return await Notification.permission === "granted" ||
            !(Notification.permission === "denied") ||
            Notification.requestPermission();
    }

    #notificationsAreSupported() {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notifications aren\'t supported.');
            console.log('Notifications aren\'t supported.');
            return false;
        }
        return true;
    }

    #pushServiceIsSupported() {
        if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
            console.log('Push messaging isn\'t supported.');
            return false;
        }
        return true;
    }

    #registerServiceWorker(serviceWorkerFile) {
        return navigator.serviceWorker.register(serviceWorkerFile);
    }

    #serviceWorkerRegistration() {
        return navigator.serviceWorker.ready;
    }

    #sendSubscriptionToServer() {
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

    #unsubscribeOnServer() {
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
}
