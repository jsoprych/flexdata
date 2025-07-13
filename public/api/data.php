<?php
header('Content-Type: text/csv');
header('Access-Control-Allow-Origin: *'); // Allow CORS for local testing

// Sample data arrays for randomization
$names = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Hannah', 'Isaac', 'Julia',
    'Kevin', 'Laura', 'Mike', 'Nancy', 'Oliver', 'Patricia', 'Quincy', 'Rachel', 'Sam', 'Tara',
    'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zach', 'Amelia', 'Ben', 'Clara', 'Daniel',
    'Ella', 'Finn', 'Gemma', 'Henry', 'Isabelle', 'Jack', 'Kylie', 'Liam', 'Mia', 'Noah'
];
$cities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Berlin', 'Toronto', 'Chicago', 'Mumbai', 'Rio',
    'Amsterdam', 'Singapore', 'Dubai', 'Seoul', 'Barcelona', 'Miami', 'Vancouver', 'Cape Town', 'Bangkok', 'Rome'
];

// Generate 50 records
$csvData = "Name,Age,City\n";
for ($i = 0; $i < 50; $i++) {
    $name = $names[array_rand($names)];
    $age = rand(18, 80); // Random age between 18 and 80
    $city = $cities[array_rand($cities)];
    $csvData .= "$name,$age,$city\n";
}

echo $csvData;
?>