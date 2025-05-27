<?php

namespace chatr\controller;

use chatr\infrastructure\ConversationRepository;
use chatr\view\layouts\ConnectedLayout;
use chatr\view\layouts\Layout;
use chatr\view\templates\components\TopBottom;

class ConversationController
{
    function subscribeToUpdates(string $observer) : void {
        $repo = new ConversationRepository();
        $conversation = $repo->id('');
        $conversation->addObserver($observer);

        echo 'ok';
    }

    function unsubscribeFromUpdates(array $queryParams) : void {

    }

    public function readConversation(array $queryParams)
    {
        //require_once dirname(__FILE__,3).'/poc/conversation.php';
        $viewMessages = new TopBottom([]);
        $view = new \chatr\view\templates\Conversation(new ConnectedLayout(), $viewMessages);
        echo $view->render();
    }
}