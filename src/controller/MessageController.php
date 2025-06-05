<?php
declare(strict_types=1);
namespace chatr\controller;

use chatr\view\layouts\OnlyContentLayout;
use chatr\view\templates\SimpleJsonTemplate;

class MessageController
{
    public function handleNewMessage(array $queryParams)
    {
        $view = new SimpleJsonTemplate(new OnlyContentLayout());
        echo $view->render();
    }
}