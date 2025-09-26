<?php

require_once __DIR__ . '/environment.php';

/**
 * CORS Headers Configuration
 * Allow Angular frontend to communicate with PHP backend
 * Now supports production domain configuration
 */

Environment::load();
$cors_origin = Environment::get('CORS_ORIGIN', '*');

// Allow from configured origin
header("Access-Control-Allow-Origin: " . $cors_origin);
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}