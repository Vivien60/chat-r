<?php
declare(strict_types=1);
namespace chatr\view\templates;

use chatr\view\layouts\Layout;

class SimpleJsonTemplate implements ITemplate
{
    public function __construct(protected Layout $layout, public mixed $data )
    {

    }

    public function render(): string
    {
        return $this->layout->buildPageFromTemplate($this);
    }

    public function getMainContent(): string
    {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }

    public function getFooter(): string
    {
        return '';
    }

    public function getContentHeader(): string
    {
        return '';
    }

    public function getHeader(): string
    {
        return '';
    }
}