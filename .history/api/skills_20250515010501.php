<?php
header('Content-Type: application/json');

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=portfolio', 'postgres', '728728');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT 
        id,
        name, 
        level, 
        icon
    FROM skills
    ORDER BY level DESC");

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>