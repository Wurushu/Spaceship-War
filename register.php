<?php

    $name = $_POST['name'];
    $score = $_POST['score'];
    $time = $_POST['time'];
    
    $pdo = new PDO('mysql:host=localhost;dbname=01_Module_C', 'admin', '1234');

    $result = $pdo->prepare("INSERT INTO rank VALUES (0,'{$name}','{$score}','{$time}')");
    $result->execute();
    
    $result = $pdo->query("SELECT * FROM rank");
    $data = $result->fetchAll(PDO::FETCH_ASSOC);
   
    echo json_encode($data);
