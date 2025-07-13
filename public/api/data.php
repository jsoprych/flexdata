<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$source = isset($_GET['source']) ? $_GET['source'] : 'sqlite';
$data = [];

if ($source === 'sqlite') {
    $dbFile = __DIR__ . '/../data/customer.db';
    if (!file_exists($dbFile)) {
        http_response_code(500);
        echo json_encode(['error' => 'SQLite database not found: ' . $dbFile]);
        exit;
    }

    try {
        $pdo = new PDO("sqlite:$dbFile");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $pdo->query('SELECT * FROM customers');
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Convert all values to strings for JSON consistency
        $data = array_map(function ($row) {
            return array_map('strval', $row);
        }, $data);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
} else {
    $csvFile = __DIR__ . '/data/data.csv';
    $headers = [];

    if (!file_exists($csvFile)) {
        http_response_code(500);
        echo json_encode(['error' => 'CSV file not found: ' . $csvFile]);
        exit;
    }

    if (($handle = fopen($csvFile, 'r')) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to open CSV file: ' . $csvFile]);
        exit;
    }

    $headers = fgetcsv($handle);
    if ($headers === false || empty($headers)) {
        fclose($handle);
        http_response_code(500);
        echo json_encode(['error' => 'Invalid CSV: No headers found']);
        exit;
    }

    $headers = array_map('trim', $headers);
    if (in_array('', $headers)) {
        fclose($handle);
        http_response_code(500);
        echo json_encode(['error' => 'Invalid CSV: Empty header names']);
        exit;
    }
    $uniqueHeaders = array_unique($headers);
    if (count($uniqueHeaders) !== count($headers)) {
        fclose($handle);
        http_response_code(500);
        echo json_encode(['error' => 'Invalid CSV: Duplicate header names']);
        exit;
    }

    while (($row = fgetcsv($handle)) !== false) {
        $rowData = [];
        foreach ($headers as $index => $header) {
            $rowData[$header] = isset($row[$index]) ? trim($row[$index]) : '';
        }
        $data[] = $rowData;
    }
    fclose($handle);
}

echo json_encode($data);
?>