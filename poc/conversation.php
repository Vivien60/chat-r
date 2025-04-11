<?php
declare(strict_types=1);
require_once "../src/autoload.php";

use chatr\model\Message;

$message = !empty($_POST['message'])?new Message(htmlentities($_POST['message'])):new Message('');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Ma conversation</title>
    <link rel="stylesheet" type="text/css" href="css/general.css" media="screen">
    <script type="module" src="js/chatUI.js"></script>
    <script type="module" src="js/conversation-init.js"></script>
    <script type="text/javascript" src="js/notifier.js"></script>
    <script type="text/javascript">
        window.conversation = {};
        window.conversation.config = () => ({
            messageInput: document.querySelector('#message'),
            sendButton: document.querySelector('#submit'),
            messagesContainer: document.querySelector('#conversation')
        });



        window.addEventListener('load', function() {
            // Check that service workers are supported, if so, progressively
            // enhance and add push messaging support, otherwise continue without it.
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(initialiseState);
            } else {
                console.warn('Service workers aren\'t supported in this browser.');
            }

            var isPushEnabled = false;
            var pushButton = document.querySelector('.js-push-button');
            pushButton.addEventListener('click', function () {
                if (isPushEnabled) {
                    //unsubscribe();
                } else {
                    subscribe();
                }
            });
        });
    </script>
</head>
<body>
<header>
    <div class="header">
        MA CONVERSATION
    </div>
</header>

<main>
    <div class="main">
        <div id="conversation">
            <div><?= $message ?></div>
        </div>
        <label for="message">
            Type your message
            <input type="text" name="message" id="message" placeholder="write a message to be sent">
        </label>
        <label for="send">
            <input type="button" name="ok" id="submit" value="OK">
        </label>
        <div><button class="js-push-button" disabled>
                Enable Push Messages
            </button></div>
    </div>

</main>

<footer>
    <div class="footer">
        <span>&copy; 2024 Phedra60. Tous droits réservés.</span>
    </div>
</footer>
</body>
</html>