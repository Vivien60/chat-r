<?php
declare(strict_types=1);
namespace chatr\model;

class Message
{
    public function __construct(public string $message)
    {
    }

    public function __toString()
    {
        return $this->message;
    }
}