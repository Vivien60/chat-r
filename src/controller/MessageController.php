<?php
declare(strict_types=1);
namespace chatr\controller;

use chatr\view\layouts\OnlyContentLayout;
use chatr\view\templates\SimpleJsonTemplate;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class MessageController
{
    public function sendNewMessage(array $queryParams)
    {
        // store the client-side `PushSubscription` object (calling `.toJSON` on it) as-is and then create a WebPush\Subscription from it
        $envSubscription = json_decode(getenv('subscription'), true);
        $subscription = Subscription::create($envSubscription);

        $securedMessage = htmlentities($queryParams['message']);
        $notifications = [
            [
                'subscription' => $subscription,
                'payload' => '{"message":"'.$securedMessage.'"}',
            ], [
                // current PushSubscription format (browsers might change this in the future)
                'subscription' => Subscription::create($envSubscription),
                'payload' => '{"message":"'.$securedMessage.'"}',
            ]
        ];
        $webPush = new WebPush();
        $report = $webPush->sendOneNotification(
            $notifications[0]['subscription'],
            $notifications[0]['payload'], // optional (defaults null)
        );
        if ($report->isSuccess()) {
            $content = "Message sent successfully for subscription.";
        } else {
            $content = "Message failed to sent for subscription : {$report->getReason()}";
        }

        $view = new SimpleJsonTemplate(new OnlyContentLayout(),$content);
        echo $view->render();
    }
}