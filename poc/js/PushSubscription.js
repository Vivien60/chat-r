// Transport de messages
import PushService from "./PushService";

export default class PushSubscription {

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.subscription = null;
        this.pushService = new PushService(serviceWorkerFile);
    }

    async setUp() {
        return this.pushService.setUp();
    }

    async notify(message, notificationOptions) {
        if (!this.#notificationsAreSupported()) {
            // Check if the browser supports notifications
            throw new Error("This browser does not support desktop notification");
        } else if(await this.pushService.requestNotificationPermission()) {
            const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
        } else {
            throw new Error("Notifications have not been granted by the user");
        }
    }

    async subscribe() {
        return await this.subscription = this.pushService.makeSubscription();
    }

    async unsubscribe() {
        return this.subscription.unsubscribe().then(this.#unsubscribeOnServer.bind(this));
    }

    syncOnServer() {
        if(this.subscription)
            this.#sendSubscriptionToServer();
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
