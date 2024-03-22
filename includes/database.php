<?php

    $servername = 'localhost';
    $username =  'root';
    $password = '';
    $dbname = 'uptask_mvc';

    try {
        $db = new mysqli($servername, $username, $password, $dbname);
        $db->set_charset('utf8');
    } catch (mysqli_sql_exception $e) {
        echo "Error de Conexion: " . mysqli_connect_error();
        exit;
    }