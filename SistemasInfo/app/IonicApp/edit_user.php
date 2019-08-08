<?php
// Cabeceras Cors, para permitir inicios de sesión

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max_Age: 86400");
}


// Cabeceras para permitir usar los metodos Get, Post y permitir el procesamiento de cabeceras
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    exit(0);
}

require "dbConnect.php";

// Leer respuesta del proveedor
$data = file_get_contents("php://input");
if (isset($data)) {
    $request = json_decode($data);

    $fullname = $request->fullname;
    $username = $request->username;
    $charge = $request->charge;

    $nuevoFullname = $request->nuevoFullname;
    $nuevoUsername = $request->nuevoUsername;
    $nuevoCharge = $request->nuevoCharge;
}


$updateUserQuery = ("UPDATE users SET email = '$nuevoUsername', name = '$nuevoFullname', role = '$nuevoCharge'
WHERE email = '$username'");

if($db->query($updateUserQuery) === TRUE){
    $response = "success";
} else{
    $response = "mismatch";
}

echo json_encode($response);

$db->close();



?>