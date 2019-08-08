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

//obtener objetos desde consulta de la APP
$data = file_get_contents("php://input");
if(isset($data)){
    $request = json_decode($data);

    $nombre = $request->nombre;
    $codigo = $request->codigo;
    $newCantidad = $request->newCantidad;
    $id = $request->id;
    $proveedor = $request->proveedor;
    $fecha = $request->fecha;
}

$entryStockQuery = ("INSERT INTO entradas (provedor, cantidad, producto_id, created_at) VALUES ('$proveedor', '$newCantidad', '$id', '$fecha')");



if($db->query($entryStockQuery) === TRUE){
    $response = "success";
} else{
    $response = "Error con la base de datos".$entryStockQuery.$db->error;
}

echo json_encode($response);

$db->close();

?>