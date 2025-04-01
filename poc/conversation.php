<?php
declare(strict_types=1);
require_once "../src/autoload.php";

use chatr\model\Message;

$message = new Message("Salut!");
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Ma conversation</title>
    <link rel="stylesheet" type="text/css" href="css/general.css" media="screen">
</head>
<body>
<header>
    <div class="header">
        MA CONVERSATION
    </div>
</header>

<main>
    <div class="main">
        <?= $message ?>
    </div>
</main>

<footer>
    <div class="footer">
        <span>&copy; 2024 Phedra60. Tous droits réservés.</span>
    </div>
</footer>
</body>
</html>