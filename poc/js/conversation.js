async function addNewMessageToChat( message="", chatContainer) {
    let div = document.createElement("div");
    div.append(message);
    chatContainer.append(div);
}