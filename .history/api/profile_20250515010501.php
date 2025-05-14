<?php
header('Content-Type: application/json');

try {
    $db = new PDO('pgsql:host=localhost;port=5432;dbname=portfolio', 'postgres', '728728');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT 
        p.id, 
        p.full_name, 
        p.profession, 
        p.short_bio, 
        p.about, 
        p.profile_pic, 
        p.email, 
        p.phone, 
        p.location,
        json_build_object(
            'linkedin', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'linkedin'),
            'github', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'github'),
            'twitter', (SELECT url FROM social_links WHERE profile_id = p.id AND platform = 'twitter')
        ) AS social
    FROM profile p
    WHERE p.id = 1");

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>