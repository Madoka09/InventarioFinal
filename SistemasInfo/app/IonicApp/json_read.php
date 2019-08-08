<?php
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");

include "dbConnect.php";
$dataEntry = array();
$queryEntry = $db->query("SELECT productos.nombre, productos.id, productos.descripcion, productos.codigo, entradas.provedor, productos.pasillo, productos.rack, productos.nivel, coalesce(SUM(entradas.cantidad), 0) as cantidad, MAX(entradas.created_at) as created_at FROM productos LEFT JOIN entradas ON productos.id = entradas.producto_id GROUP BY productos.nombre");
if($queryEntry->num_rows > 0){
    while($rowEntry = $queryEntry->fetch_assoc()){
        $dataEntry[] = $rowEntry;
    }
}

echo json_encode($dataEntry);
echo mysqli_error($db);

?>