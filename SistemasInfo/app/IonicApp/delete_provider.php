<?php
// Cabeceras Cors, para permitir inicios de sesión
if(isset($_SERVER['HTTP_ORIGIN'])){
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max_Age: 86400");
}


// Cabeceras para permitir usar los metodos Get, Post y permitir el procesamiento de cabeceras
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){

    if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }

    if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    exit(0);
}

require "dbConnect.php";

// Leer respuesta de la aplicación y tomar el objeto "nombre proveedor"
$data = file_get_contents("php://input");
if(isset($data)){
    $request = json_decode($data);

    $nombreProveedor = $request->nombreProveedor;

}

// Construir Query para borrar producto
$deleteProvider = ("DELETE FROM provedores WHERE nombre = '$nombreProveedor'");

if($db->query($deleteProvider) === TRUE){
    $response = "success";
} else{
    $response = "Error con la base de datos".$deleteProvider.$db->error;
}

echo json_encode($response);


$db->close();


?>