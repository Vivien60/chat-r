// Transport de messages
import PushService from "./PushService.js";
import ChatApi from "./ChatApi.js";

export default class PushSubscription {

    constructor(serviceWorkerFile = '/service-worker.js', api) {
        this.subscription = null;
        this.pushService = new PushService(serviceWorkerFile);
        this.api = api;
    }

    async setUp() {
        await this.pushService.setUp();
        this.subscription = this.pushService.subscription;
        console.log(this.subscription?.getKey('p256dh'));
        console.log(this.subscription?.getKey('auth'));
        return this.subscription;
    }


    send(message, notificationOptions) {
        //this.notify(message, notificationOptions);
        //this.pushService.send(message);
        return ChatApi.sendMessage(message);
    }

    notify(message, notificationOptions) {

        console.log(this.pushService.subscription);
        if (!this.pushService.usable) {
            // Check if the browser supports notifications
            throw new Error("This browser does not support desktop notification or notifications have not been granted by the user");
        } else if(!!this.pushService.subscription) {
            const notification = new Notification(message, {body: notificationOptions.body, icon: notificationOptions.img});
        } else {
            throw new Error("User has not subscribed to notifications");
        }
    }

    async subscribe() {
        this.subscription = await this.pushService.subscribe();
        return true;
    }

    async unsubscribe() {
        let subscription = await this.pushService.unsubscribe();
        await this.#unsubscribeOnServer();
        this.subscription=subscription;

        return true;
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
        return fetch('/register-subscription', {
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
