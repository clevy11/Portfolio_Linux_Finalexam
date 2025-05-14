<?php
header('Content-Type: application/json');

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=portfolio', 'postgres', '728728');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT 
        p.id,
        p.title,
        p.description,
        p.image,
        p.link,
        array_agg(pt.tag_name) AS tags
    FROM projects p
    JOIN project_tags pt ON p.id = pt.project_id
    GROUP BY p.id, p.title, p.description, p.image, p.link
    ORDER BY p.id");

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>