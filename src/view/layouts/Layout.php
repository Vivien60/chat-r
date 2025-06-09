<?php
declare(strict_types=1);

namespace chatr\view\layouts;

use chatr\view\templates\ITemplate;

abstract class Layout
{
    public string $header = '';
    public string $contentHeader = '';
     public string $footer = '';
     public string $mainContent = '';
    private ITemplate $template;

    public function __construct()
    {
    }

    public function getHeader(): string
    {
        return $this->header;
    }

    public function getFooter(): string
    {
        return $this->footer;
    }

    public function __toString() : string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            {$this->template->getHeader()}
        </head>
        <body>
        <header>
            <div class="header">
                {$this->template->getContentHeader()}
            </div>
        </header>

        <main>
            <div class="main">
                {$this->template->getMainContent()}
            </div>
        </main>

        <footer>
            <div class="footer">
                {$this->template->getFooter()}
            </div>
        </footer>
        </body>
        </html>
        HTML;
    }

    public function buildPageFromTemplate(ITemplate $template): string
    {
        $this->template = $template;
        return (string)$this;
    }
}