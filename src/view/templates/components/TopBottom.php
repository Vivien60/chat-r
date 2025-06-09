<?php
declare(strict_types=1);

namespace chatr\view\templates\components;

use Iterator;

class TopBottom extends Component
{
    public Iterator|array $items;

    /**
     * @param array|Iterator $items
     */
    public function __construct(Iterator|array $items)
    {
        $this->items = $items;
    }

    public function renderElt() : Iterator
    {
        $html = "<div>%s</div>";
        foreach ($this->items as $item) {

            yield sprintf($html, $item->getContent());
        }

        yield "</div>";
    }

    public function render() : string
    {
        return '';
        $content = '<div class="mosaicList">';
        foreach($this->renderElt() as $eltContent)
            $content .= $eltContent;
        $content .= "</div>";
        return $content;
    }
}