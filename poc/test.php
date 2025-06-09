<html lang="fr">
<head>
    <title>test</title>
</head>
<body>
<form name="test"
      action="https://updates.push.services.mozilla.com/wpush/v1/gAAAAABoOHJAUof_Xuz_gBqKTTwXH7zS_8sFPe3KuccZpayz50ueiQV1IdQ-7BgkPiktXUF2HxFSl8yLAWJXLF2BvGJQwY2fy4tZb9CF99uIDfg1iC4lQXa11rOibJKsrBR-_WNXv3Rp"
      method="POST"
      >
    <label for="message">
        <input type="text" name="message" />
    </label>
    <input type="hidden" name="TTL" value="2000" />
</form>


<?php
require_once "../src/autoload.php";
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
// store the client-side `PushSubscription` object (calling `.toJSON` on it) as-is and then create a WebPush\Subscription from it
        $envSubscription = json_decode(getenv('subscription'), true);
var_dump($envSubscription);
        $subscription = Subscription::create($envSubscription);

// array of notifications
        $notifications = [
            [
                'subscription' => $subscription,
                'payload' => '{"message":"Hello World!"}',
            ], [
                // current PushSubscription format (browsers might change this in the future)
                'subscription' => Subscription::create($envSubscription),
                'payload' => '{"message":"Hello World!"}',
            ]
        ];
        $webPush = new WebPush();
        $report = $webPush->sendOneNotification(
            $notifications[0]['subscription'],
            $notifications[0]['payload'], // optional (defaults null)
        );
if ($report->isSuccess()) {
    echo "[v] Message sent successfully for subscription.";
} else {
    echo "[x] Message failed to sent for subscription : {$report->getReason()}";
}
var_dump($report->getEndpoint(), $report->getResponse(), $report->getResponseContent());
?>
</body>
</html>