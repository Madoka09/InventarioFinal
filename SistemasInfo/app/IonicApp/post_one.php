<?php
// Cabeceras Cors, para permitir inicios de sesión
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Headers: content-type");
include_once "dbConnect.php";

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$message = array();
switch ($data['action']) {
    //Insertar un item en la tabla Stock, en este caso un articulo
    case "insertItem":
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $codigo = $data['codigo'];
        $rack = $data['rack'];
        $pasillo = $data['pasillo'];
        $nivel = $data['nivel'];
        //realizar consulta y devolver respuesta
        $addItemQuery = mysqli_query($db, "INSERT INTO `productos` (`nombre`,`descripcion`,`codigo`, `cantidad`, `rack`,`pasillo`,`nivel`) VALUES ('$nombre', '$descripcion', '$codigo', '0', '$rack', '$pasillo', '$nivel')");
        
        //Obtener ID del producto entrante
        $checkQuery = mysqli_query($db, "SELECT id FROM productos WHERE nombre = '$nombre'");

        if($checkQuery){
            $newID = $checkQuery->fetch_object()->id;
        }

        if ($addItemQuery) {
            $message['status'] = "success";
        } else {
            $message['status'] = "error";
        }
        
        echo json_encode($message);
        break;

    case "insertProvider":
        $nombreProvedor = $data['proveedor'];

        $addProviderQuery = mysqli_query($db, "INSERT INTO provedores (nombre) VALUES ('$nombreProvedor')");
        if($addProviderQuery){
            $message['status'] = "success";
        } else{
            $message['status'] = "error";
        }
        echo json_encode($message);
        break;
}
echo mysqli_error($db);
?>