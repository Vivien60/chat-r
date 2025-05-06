export default class PushService {
    #requestedPermission = false;
    #usability = false;
    #serviceWorkerFile;

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.#serviceWorkerFile = serviceWorkerFile;
    }

    async setUp() {
        return this.#setUsability()
            .then(this.#registerServiceWorker.bind(this))
            .then(this.#initWithClientSubscription.bind(this))
            .catch(error => Promise.reject(new Error("Push messaging is not supported.")));
    }

    makeSubscription() {
        return this.#serviceWorkerRegistration()
            .then(this.#subscribeToPushNotifications.bind(this))
            .then(function() {return this.subscription}.bind(this))
            .catch(error => Promise.reject(new Error("Unable to subscribe to push.")));
    }

    async #subscribeToPushNotifications(serviceWorkerRegistration) {
        this.subscription = await serviceWorkerRegistration.pushManager.subscribe();
    }

    async #setUsability() {
        this.#usability = await this.#isUsable();
    }

    async #initWithClientSubscription() {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        this.subscription = subscription;
        return subscription;
    }

    #registerServiceWorker() {
        return navigator.serviceWorker.register(this.#serviceWorkerFile);
    }

    #serviceWorkerRegistration() {
        return navigator.serviceWorker.ready;
    }

    async #isUsable() {
        return (this.#notificationsAreSupported() && this.#pushServiceIsSupported() && await this.#requestNotificationPermission());
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

    async #requestNotificationPermission() {
        this.#requestedPermission = true;
        return await Notification.permission === "granted" ||
            !(Notification.permission === "denied") ||
            Notification.requestPermission();
    }
}