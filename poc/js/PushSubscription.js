// Transport de messages
import PushService from "./PushService.js";

export default class PushSubscription {

    constructor(serviceWorkerFile = '/service-worker.js') {
        this.subscription = null;
        this.pushService = new PushService(serviceWorkerFile);
    }

    async setUp() {
        this.subscription = await this.pushService.setUp();
        return this.subscription;
    }


    async send(message, notificationOptions) {
        await this.notify(message, notificationOptions);
        //this.pushService.send(message);
    }

    async notify(message, notificationOptions) {
        console.log('notifying', this);
        if (!this.pushService.usable) {
            // Check if the browser supports notifications
            throw new Error("This browser does not support desktop notification");
        } else if(await this.subscribe()) {
            const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
        } else {
            throw new Error("Notifications have not been granted by the user");
        }
    }

    async subscribe() {
        return this.subscription = await this.pushService.subscribe();
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
        return true;
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
