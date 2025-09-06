<?php
// Simple endpoint for external cron services
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit('Method not allowed');
}

// Trigger your stock fetching logic
$response = file_get_contents('https://your-domain.com/api/fetch-stocks');
echo json_encode(['status' => 'triggered', 'response' => $response]);
?>