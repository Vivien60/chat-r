export default class ChatApi {
    constructor() {
    }
    static async sendMessage(message) {
        console.log(message);
        return this.#postRequest('/send-message', message, []);
    }

    static async subscribe() {

    }

    static async unsubscribe() {}

    static #postRequest(url, postData, headers) {
        const body = this.#convertDataForPostRequest(postData);
        console.log(body);
        const method = 'POST';
        return fetch(url, { body, method, headers }).then((res) => res.json())
    }

    static #convertDataForPostRequest(...params) {
        console.log(params);
        const donneesFormulaires = new FormData();
        for(let i=0;i<params.length;i++) {
            console.log('boucle ', params[i]);
            donneesFormulaires.append("message", params[i]);
        }
        return donneesFormulaires;
    }
}