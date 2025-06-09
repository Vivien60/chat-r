<?php

namespace chatr;

use chatr\controller\ConversationController;
use chatr\controller\MessageController;

class Router
{
    public function __construct(){}

    //TODO Vivien : isoler les responsabilités "route" et "gestion des params de requêtes/instanciation"
    //  Peut-être avec une factory statique
    public static function route(string $action, array $queryParams) : string {
        $queryParams = array_change_key_case($queryParams, CASE_LOWER);
        switch($action) {
            case 'register-subscription':
                $controller = new ConversationController();
                $controller->subscribeToUpdates($queryParams['observer']);
                break;
            case 'unregister-subscription':
                $controller = new ConversationController();
                $controller->unsubscribeFromUpdates($queryParams);
                break;
            case 'conversation':
                $controller = new ConversationController();
                $controller->readConversation($queryParams);
                break;
            case 'send-message':
                $controller = new MessageController();
                $controller->sendNewMessage($queryParams);
                break;
            default:
                header('Location: /404.php');
        }
        return '';
    }
}