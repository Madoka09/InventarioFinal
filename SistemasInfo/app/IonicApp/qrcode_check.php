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

// Leer respuesta de la aplicación y tomar el objeto "nombre proveedor"

$data = file_get_contents("php://input");
if (isset($data)) {
    $request = json_decode($data);

    $query = $request->scannedCode;
}

// Iterar string recibida y crear dos variables conteniendo codigo y nombre
$newValues = explode ("|", $query);

$searchQR = "SELECT * FROM productos WHERE codigo = "."'".$newValues[1]."'"." AND nombre = "."'".$newValues[0]."'";

$doQuery = $db->query($searchQR);
if ($doQuery->num_rows > 0) {
    while ($row = $doQuery->fetch_assoc()) {
        $result = intval($row['id']);
    }
}

$updatedQuery = ("SELECT productos.nombre, productos.id, productos.descripcion, productos.codigo, entradas.provedor, productos.pasillo, productos.rack, productos.nivel, SUM(entradas.cantidad) as cantidad, MAX(entradas.created_at) as created_at FROM productos INNER JOIN entradas ON productos.id = $result GROUP BY productos.nombre");

$realQuery = $db->query($updatedQuery);
if($realQuery->num_rows > 0){
    while ($row1 = $realQuery->fetch_assoc()){
        $fullQuery = $row1;
    }
}

echo json_encode($fullQuery);
echo mysqli_error($db);

?>