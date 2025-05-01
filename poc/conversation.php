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
    <script type="module" src="js/ChatUI.js"></script>
    <script type="module" src="js/conversation-init.js"></script>
    <script type="module" src="js/PushMessaging.js"></script>
    <script type="text/javascript">
        window.conversation = {};
        window.conversation.config = () => ({
            messageInput: document.querySelector('#message'),
            sendButton: document.querySelector('#submit'),
            messagesContainer: document.querySelector('#conversation')
        });
        window.pushMessaging = {};
        window.pushMessaging.config = () => ({
            pushButton: document.querySelector('.js-push-button'),
            unsubscribeButton: document.querySelector('.js-unsubscribe-button'),
            notifyMeButton: document.querySelector('.js-notifyme-button')
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
            </button>
            <button class="js-unsubscribe-button" disabled>
                Disable Push Messages
            </button>
            <button class="js-notifyme-button" disabled>
                Display a notification
            </button>
        </div>
    </div>

</main>

<footer>
    <div class="footer">
        <span>&copy; 2024 Phedra60. Tous droits réservés.</span>
    </div>
</footer>
</body>
</html>