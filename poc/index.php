<?php
declare(strict_types=1);
require_once "../src/autoload.php";

$queryGet = filter_input_array(INPUT_GET, FILTER_SANITIZE_FULL_SPECIAL_CHARS)?:[];
$queryPost = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS)?:[];
$queryParams = array_merge($queryGet, $queryPost);
$router = new \chatr\Router();
$router->route($queryParams['action'], $queryParams?:[]);