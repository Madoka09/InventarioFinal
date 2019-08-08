<?php
// Cabeceras Cors, para permitir inicios de sesión

if(isset($_SERVER['HTTP_ORIGIN'])){
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max_Age: 86400");
}


// Cabeceras para permitir GET, POST y enviar opciones 

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

// Obtener datos desde app, y decodificar JSON

$data = file_get_contents("php://input");
if(isset($data)){
    $request = json_decode($data);

    $nombre = $request->nombre;
    $codigo = $request->codigo;
    $cantidad = $request->cantidad;
    $departure = $request->departure;
    $id = $request->id;
    $date = $request->date;

    $departureNombre = $request->departureNombre;
    $departureCodigo = $request->departureCodigo;
    $departureCantidad = $request->departureCantidad;
    $departureQty = $request->departureQty;
    $departureNew = $request->departureNew;
}

$departure = ("INSERT INTO salidas (cantidad, producto_id, created_at) VALUES ('$departureQty', '$id', '$date')");

if($db->query($departure) === TRUE){
    $response = "success";
} else{
    $response = "Error con la base de datos".$departure.$db->error;
}

echo json_encode($response);


$db->close();

?>