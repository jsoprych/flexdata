<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$csvFile = __DIR__ . '/../data.csv';
$data = [];
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

// Read headers
$headers = fgetcsv($handle);
if ($headers === false || empty($headers)) {
    fclose($handle);
    http_response_code(500);
    echo json_encode(['error' => 'Invalid CSV: No headers found']);
    exit;
}

// Validate headers (non-empty, unique)
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

// Read data rows
while (($row = fgetcsv($handle)) !== false) {
    $rowData = [];
    foreach ($headers as $index => $header) {
        $rowData[$header] = isset($row[$index]) ? trim($row[$index]) : '';
    }
    $data[] = $rowData;
}
fclose($handle);

// Check if data is empty
if (empty($data)) {
    echo json_encode([]);
    exit;
}

echo json_encode($data);
?>