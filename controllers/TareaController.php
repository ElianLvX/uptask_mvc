<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;
use MVC\Router;

class TareaController
{
    public static function index()
    {
        $proyectoId = $_GET['id'];

        if (!$proyectoId) header('Location: /dashboard');

        $proyecto = Proyecto::where('url', $proyectoId);
        session_start();
        isAuth();
        // Validaciones que estan en el condicional
        // 1 Valida si no existe el proyecto
        // 2 valida que si el proyecto con su propietario es diferente al usuario que tenemos en la sesion
        if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) header('Location: /404');

        $tareas = Tarea::belongsTo('proyectoId', $proyecto->id);

        echo json_encode(['tareas' => $tareas], JSON_PRETTY_PRINT);
    }

    public static function crear()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            session_start();
            isAuth();

            $proyectoId = $_POST['proyectoId'];

            $proyecto = Proyecto::where('url', $proyectoId);

            if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al agregar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }

            // Todo bien, Instanciar y crear la tarea
            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();

            $respuesta = [// Esta respuesta se le pasa al frontEnd para las alertas con Estilos
                'tipo' => 'exito',
                'id' => $resultado['id'],
                'mensaje' => 'Tarea creada correctamente',
                'proyectoId' => $proyecto->id
            ];
            http_response_code(201);
            echo json_encode($respuesta);
        }
    }

    public static function actualizar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Vlidar que el proyecto Exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);

            session_start(); // Para tener disponibles la variable $_SESSION
            isAuth();

            if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }
            /*
                Lo que se esta haciendo en pocas palabras es que con la URL vamos a buscar
                la tabla Proyecto que Proyecto tiene esa url y nos trae el registro completo
                junto con el id que tiene ese registro, ahora ese ID lo vinculamos con lo
                que nos trae $_POST es decir el FormData cambiamos el contenido de $tarea->proyectoId
                que contiene el URL del Proyecto por la ID del proyecto que acabamos de consultar
                que contiene la variable llamada $proyecto, MUCHO GASTO DE LOGICA A MI PARECER
                PERO BUENO.
                $tarea->proyectoId  :   actualemente tiene la URL del Proyecto NO EL ID
                $proyecto->id       :   este si tiene el id del Proyecto
            */
            // Sincroniza el Virtual Dom, Active Record y con la BD

            $tarea = new Tarea($_POST); // Vinculamos la Tarea con el constructor de Tarea
            $tarea->proyectoId = $proyecto->id; // Cambiamos la URL del Proyecto por su ID

            $resultado = $tarea->guardar();
            if ($resultado) {
                $respuesta = [
                    'tipo' => 'exito',
                    'id' => $tarea->id,
                    'proyectoId' => $proyecto->id,
                    'mensaje' => 'Actualizado Correctamente'
                ];
                echo json_encode(['respuesta' => $respuesta], JSON_PRETTY_PRINT);
            }
        }
    }

    public static function eliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Vlidar que el proyecto Exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);

            session_start(); // Para tener disponibles la variable $_SESSION

            if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }

            $tarea = new Tarea($_POST);
            $resultado = $tarea->eliminar();

            $resultado = [
                'resultado' => $resultado,
                'mensaje' => 'Eliminado Correctamente',
                'tipo' => 'exito'
            ];

            echo json_encode($resultado);
        }
    }
}
