<?php
declare(strict_types=1);
require_once "../src/autoload.php";

$queryParams = filter_input_array(INPUT_GET, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$router = new \chatr\Router();
$router->route($queryParams['action'], $queryParams?:[]);