<?php
declare(strict_types=1);

namespace chatr\view\templates;

use chatr\view\layouts\Layout;
use chatr\view\templates\components\Component;

class Conversation extends Template
{
    public string $title = 'MA CONVERSATION';
    private Component $typeList;

    public function __construct(Layout $layout, Component $typeList)
    {
        parent::__construct($layout);
        $this->typeList = $typeList;
    }

    /**
     * @return string[]
     */
    protected function defaultHeaders() : array
    {
        return [
            ...parent::defaultHeaders(),
            <<<HEADERS
                <script type="module" src="js/ChatUI.js"></script>
                <script type="module" src="js/conversation-init.js"></script>
                <script type="module" src="js/PushSubscription.js"></script>
                <script type="text/javascript">
                    window.conversation = {};
                    window.conversation.config = () => ({
                        messageInput: document.querySelector('#message'),
                        sendButton: document.querySelector('#submit'),
                        messagesContainer: document.querySelector('#conversation')
                    });
                    window.pushMessaging = {};
                    window.pushMessaging.config = () => ({
                        pushButton: document.querySelector('.js-push-button'),
                        unsubscribeButton: document.querySelector('.js-unsubscribe-button'),
                        notifyMeButton: document.querySelector('.js-notifyme-button')
                    });
            
                </script>
HEADERS
        ];
    }
    public function mainContent(): string
    {
        return "
            <div id='conversation'>
                ".$this->typeList->render()."
            </div>".
        <<<MAIN
            <label for="message">
                Type your message
                <input type="text" name="message" id="message" placeholder="write a message to be sent">
            </label>
            <label for="send">
                <input type="button" name="ok" id="submit" value="OK">
            </label>
            <div><button class="js-push-button" disabled>
                    Enable Push Messages
                </button>
                <button class="js-unsubscribe-button" disabled>
                    Disable Push Messages
                </button>
                <button class="js-notifyme-button" disabled>
                    Display a notification
                </button>
            </div>
        MAIN;
    }
}