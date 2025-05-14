<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$dbConfig = [
    'host' => 'localhost',
    'dbname' => 'portfolio',
    'user' => 'postgres',
    'password' => 'your_password_here'
];

try {
    $pdo = new PDO("pgsql:host={$dbConfig['host']};dbname={$dbConfig['dbname']}", 
                  $dbConfig['user'], $dbConfig['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $endpoint = $_GET['endpoint'] ?? '';

    switch($endpoint) {
        case 'profile':
            $stmt = $pdo->query('SELECT * FROM profile LIMIT 1');
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            break;
            
        case 'social_links':
            $stmt = $pdo->query('SELECT * FROM social_links');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'skills':
            $stmt = $pdo->query('SELECT * FROM skills');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'projects':
            $stmt = $pdo->query('SELECT * FROM projects');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'project_tags':
            $stmt = $pdo->query('SELECT * FROM project_tags');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>