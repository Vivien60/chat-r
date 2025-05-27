<?php
declare(strict_types=1);

namespace chatr\view\templates;

use chatr\view\layouts\Layout;

abstract class Template
{
    protected Layout $layout;
    /**
     * @var string[]
     */
    public array $headers;
    public string $title = '';

    public string $footer = <<<FOOT
        <span>&copy; 2025 Phedra60. Tous droits réservés.</span>
        <span><a href="/rgpd.php">Politique de confidentialité</a></span>
    FOOT;
    public string $contentHeader = <<<CONTENT
        %s
    CONTENT;



    /**
     * @param Layout $layout
     * @param string[] $headers
     */
    public function __construct(Layout $layout, array $headers = [])
    {
        $this->layout = $layout;
        $this->headers = $headers?:$this->defaultHeaders();
        $this->contentHeader = sprintf($this->contentHeader, $this->title);
    }

    /**
     * @return string[]
     */
    protected function defaultHeaders() : array
    {
        return [
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<title>'.$this->title.'</title>',
            '<link rel="stylesheet" type="text/css" href="/css/general.css" media="screen">'
        ];
    }

    /**
     * @param string[] $headers
     * @return $this
     */
    public function setHeaders(array $headers) : self
    {
        $this->headers = $headers;
        return $this;
    }

    public function header() : string
    {
        return implode(PHP_EOL, $this->headers);
    }

    abstract public function mainContent() : string;

    public function render() : string
    {
        $this->layout->mainContent = $this->mainContent();
        $this->layout->contentHeader = $this->contentHeader;
        $this->layout->footer = $this->footer;
        $this->layout->header = $this->header();

        return (string)$this->layout;
    }
}