<?php
declare(strict_types=1);
namespace chatr\controller;

use chatr\view\layouts\OnlyContentLayout;
use chatr\view\templates\SimpleJsonTemplate;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class MessageController
{
    public function handleNewMessage(array $queryParams)
    {
// store the client-side `PushSubscription` object (calling `.toJSON` on it) as-is and then create a WebPush\Subscription from it
        $envSubscription = json_decode(getenv('subscription'), true);
        $subscription = Subscription::create($envSubscription);

// array of notifications
        $notifications = [
            [
                'subscription' => $subscription,
                'payload' => '{"message":"Hello World!"}',
            ], [
                // current PushSubscription format (browsers might change this in the future)
                'subscription' => Subscription::create([
                    "endpoint" => $envSubscription['endpoint'],
                    "keys" => $envSubscription['keys'],
                ]),
                'payload' => '{"message":"Hello World!"}',
            ]
        ];
        $webPush = new WebPush();
        $report = $webPush->sendOneNotification(
            $notifications[0]['subscription'],
            $notifications[0]['payload'], // optional (defaults null)
        );

        $view = new SimpleJsonTemplate(new OnlyContentLayout([]));
        echo $view->render();
    }
}