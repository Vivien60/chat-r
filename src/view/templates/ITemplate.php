<?php
declare(strict_types=1);
namespace chatr\view\templates;

interface ITemplate
{
    public function render() : string;
    public function getMainContent() : string;

    public function getFooter() : string;

    public function getContentHeader() : string;

    public function getHeader() : string;
}