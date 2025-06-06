//TODO Vivien :
// Possède plusieurs statuts : granted, usability et subscription
// Voir pour modifier en un seul statut qui contiendrait par étape successives : "usable/compatible", "granted" et "subscribed"


export default class PushService {
    #requestedPermission = false;
    #usability = false;
    granted = false;
    subscription = null;
    get usable() {
        return this.#usability;
    }
    #serviceWorkerFile;

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.#serviceWorkerFile = serviceWorkerFile;
    }

    async setUp() {
        return this.#checkUsability()
            .then(this.#initServiceWorker.bind(this))
            .then(this.#fetchClientSubscription.bind(this))
            .then(function() {
                console.log(this.subscription)
            }.bind(this))
            .catch((error )=> {
                console.log(error);
                Promise.reject(new Error("Push messaging is not supported."))
            });
    }

    subscribe() {
        return this.#serviceWorkerRegistrationReady()
            .then(this.#doSubscribe.bind(this))
            .catch(error => Promise.reject(new Error("Unable to subscribe to push.")));
    }

    async unsubscribe() {
        await this.subscription?.unsubscribe();
        this.subscription = null;
        return this.subscription;
    }

    allowed() {
        return this.#requestedPermission;
    }

    async #checkUsability() {
        this.#usability = await this.#isUsable();
    }

    async #isUsable() {
        return (this.#notificationsAreSupported() && this.#pushServiceIsSupported()
            && await this.#requestNotificationPermission());
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
        this.granted = Notification.permission === "granted" || !(Notification.permission === "denied");
        return this.granted ||
            Notification.requestPermission().then((grant) => this.granted = grant);
    }

    async #doSubscribe(serviceWorkerRegistration) {
        this.subscription = await serviceWorkerRegistration.pushManager.subscribe();
        return this.subscription;
    }

    #serviceWorkerRegistrationReady() {
        return navigator.serviceWorker.ready;
    }

    send(message) {

    }
}