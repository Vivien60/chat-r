<?php
declare(strict_types=1);

namespace chatr\view\layouts;

abstract class Layout
{
    public string $header = '';
    public string $contentHeader = '';
     public string $footer = '';
     public string $mainContent = '';

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
            $this->header
        </head>
        <body>
        <header>
            <div class="header">
                $this->contentHeader
            </div>
        </header>

        <main>
            <div class="main">
                $this->mainContent
            </div>
        </main>

        <footer>
            <div class="footer">
                $this->footer
            </div>
        </footer>
        </body>
        </html>
        HTML;
    }
}