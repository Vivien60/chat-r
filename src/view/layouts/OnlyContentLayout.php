<?php
declare(strict_types=1);
namespace chatr\view\layouts;

class OnlyContentLayout extends Layout
{
    public function __construct()
    {
        parent::__construct();
    }

    public function __toString() : string
    {
        return $this->mainContent;
    }
}