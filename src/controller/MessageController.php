<?php
declare(strict_types=1);
namespace chatr\controller;

use chatr\model\Conversation;
use chatr\view\layouts\OnlyContentLayout;
use chatr\view\templates\SimpleJsonTemplate;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class MessageController
{
    public function sendNewMessage(array $queryParams)
    {
        $securedMessage = htmlentities($queryParams['message']);
        $envSubscription = json_decode(getenv('subscription'), true);
        $message = new \chatr\model\Message($securedMessage);
        $conversation = new Conversation();
        $conversation->addMessage($message);
        $conversation->sendNewMessages();
        $conversation->save();
        if ($report->isSuccess()) {
            $content = "Message sent successfully for subscription.";
        } else {
            $content = "Message failed to sent for subscription : {$report->getReason()}";
        }

        $view = new SimpleJsonTemplate(new OnlyContentLayout(),$content);
        echo $view->render();
    }
}