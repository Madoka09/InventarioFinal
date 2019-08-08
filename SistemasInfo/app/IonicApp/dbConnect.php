<?php 
// Conexión a la base de datos
require("C:\AppServ\www\dbConfigInventario.php");
$db = mysqli_connect('localhost', 'root', 'Ikaros2009', 'inventory');
if (!$db) {
    die("Error en la conexion" . mysql_connect_error());
}
?>