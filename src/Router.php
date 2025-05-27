<?php

namespace chatr;

use chatr\controller\ConversationController;

class Router
{
    public function __construct(){}

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
            default:
                header('Location: /404.php');
        }
        return '';
    }
}