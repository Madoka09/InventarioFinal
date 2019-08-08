<?php 
// Cabeceras Cors para permitir autenticación de usuarios

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

$data = file_get_contents("php://input");
if(isset($data)){
    $request = json_decode($data);

    $id = $request->id;
    $codigo = $request->codigo;
    $cantidadNueva = $request->salidaNueva;
    $cantidadVieja = $request->salidaVieja;
    $fecha = $request->date;

    //Realizar operacion de comparación entre la cantidad antigua y la ingresada por el usuario
    $doMath = ($cantidadVieja - $cantidadNueva);
    
    $newQuery = ("INSERT INTO salidas (`cantidad`, `producto_id`, `created_at`) VALUES ($cantidadNueva, $id, '$fecha')");

    if($db->query($newQuery) === TRUE){
        $response = "success";
    } else {
        $response = "Error con la base de datos".$newQuery.$db->error;
    }


} else{
    echo "FATAL...";
}

echo json_encode($response);

$db->close();

?>