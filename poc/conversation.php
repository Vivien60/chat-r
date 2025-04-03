<?php
declare(strict_types=1);
require_once "../src/autoload.php";

use chatr\model\Message;

$message = !empty($_POST['message'])?new Message(htmlentities($_POST['message'])):new Message('...');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Ma conversation</title>
    <link rel="stylesheet" type="text/css" href="css/general.css" media="screen">
    <script type="text/javascript" src="js/conversation.js"></script>
    <script type="text/javascript" src="js/conversation-init.js"></script>

</head>
<body>
<header>
    <div class="header">
        MA CONVERSATION
    </div>
</header>

<main>
    <div class="main">
        <div class="conversation">
            <div><?= $message ?></div>
        </div>
        <label for="message">
            Type your message
            <input type="text" name="message" id="message" placeholder="write a message to be sent">
        </label>
        <label for="send">
            <input type="button" name="ok" id="submit" value="OK">
        </label>
    </div>
</main>

<footer>
    <div class="footer">
        <span>&copy; 2024 Phedra60. Tous droits réservés.</span>
    </div>
</footer>
</body>
</html>