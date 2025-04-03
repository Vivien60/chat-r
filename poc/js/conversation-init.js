document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit').addEventListener('click', () => {
        let container = document.querySelector('.conversation');
        let message = document.querySelector('#message').value;
        addNewMessageToChat(message, container);
        document.querySelector('#message').value = '';
    })
});