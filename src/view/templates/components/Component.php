<?php
declare(strict_types=1);

namespace chatr\view\templates\components;

abstract class Component
{

    abstract public function render() : string;
}