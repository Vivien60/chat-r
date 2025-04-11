import ChatUIHandler from "./chatUI.js";

const {messageInput, sendButton, messagesContainer} = conversation.config();
let chat = new ChatUIHandler({messageInput, messagesContainer, sendButton});
chat.init();
