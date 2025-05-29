<?php
declare(strict_types=1);
namespace chatr\infrastructure;

use chatr\model\Conversation;

class ConversationRepository
{

    public function __construct()
    {
    }

    public function id(string $string) : Conversation
    {
        //TODO : get conversation by id
        return new Conversation();
    }
}