export default class PushService {
    #requestedPermission = false;
    #usability = false;
    get usable() {
        return this.#usability;
    }
    #serviceWorkerFile;

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.#serviceWorkerFile = serviceWorkerFile;
    }

    async setUp() {
        return this.#fetchUsability()
            .then(this.#initServiceWorker.bind(this))
            .then(this.#fetchClientSubscription.bind(this))
            .catch(error => Promise.reject(new Error("Push messaging is not supported.")));
    }

    subscribe() {
        return this.#serviceWorkerRegistrationReady()
            .then(this.#subscribeToPushNotifications.bind(this))
            .then(function() {return this.subscription}.bind(this))
            .catch(error => Promise.reject(new Error("Unable to subscribe to push.")));
    }

    async #fetchUsability() {
        this.#usability = await this.#isUsable();
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

    #initServiceWorker() {
        return navigator.serviceWorker.register(this.#serviceWorkerFile);
    }

    async #fetchClientSubscription() {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        this.subscription = subscription;
        return subscription;
    }

    async #requestNotificationPermission() {
        this.#requestedPermission = true;
        return await Notification.permission === "granted" ||
            !(Notification.permission === "denied") ||
            Notification.requestPermission();
    }

    async #subscribeToPushNotifications(serviceWorkerRegistration) {
        this.subscription = await serviceWorkerRegistration.pushManager.subscribe();
    }

    #serviceWorkerRegistrationReady() {
        return navigator.serviceWorker.ready;
    }

    send(message) {
        
    }
}