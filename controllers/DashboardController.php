<?php

namespace Controllers;

use Model\Proyecto;
use Model\Usuario;
use MVC\Router;

class DashboardController {

    public static function index(Router  $router)
    {
        session_start(); // Iniciamos la sesion que se creo al momento del login
        isAuth(); // Verifica si el usuario actual esta autenticado

        $id = $_SESSION['id'];

        $proyectos = Proyecto::belongsTo('propietarioId', $id);

        $router->render('dashboard/index',[
            'titulo' => 'Proyectos',
            'proyectos' => $proyectos
        ]);
    }

    public static function crear_proyecto(Router $router)
    {
        session_start(); // Iniciamos la sesion que se creo al momento del login
        isAuth(); // Verifica si el usuario actual esta autenticado
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyecto = new Proyecto($_POST);

            // Validacion
            $alertas = $proyecto->validarProyecto();

            if (empty($alertas)) {
                // Generar un URL Única
                $proyecto->url = md5(uniqid()); // Forma correcta de Utilizar md5, no utilizar para(Passwords, ni para hashear nada)

                // Almacenar el creador del Proyecto
                $proyecto->propietarioId = $_SESSION['id'];

                // Guardar el proyecto
                $proyecto->guardar(); // Generamos el proyecto

                // Redireccionamos al proyecto actualmente creado por la url del mismo
                header('Location: /proyecto?id=' . $proyecto->url);
            }
        }

        $router->render('dashboard/crear-proyecto',[
            'titulo' => 'Crear Proyectos',
            'alertas' => $alertas
        ]);
    }

    public static function proyecto(Router $router)
    {
        session_start(); // Iniciamos la sesion que se creo al momento del login
        isAuth(); // Verifica si el usuario actual esta autenticado

        $token = $_GET['id'];

        if (!$token) header('Location: /dashboard');
        // Revisar que la URL la este viendo el usuario que la creo
        $proyecto = Proyecto::where('url', $token);

        if ($_SESSION['id'] !== $proyecto->propietarioId) {
            header('Location: /dashboard');
        }

        $nombreProyecto = $proyecto->proyecto;

        $router->render('dashboard/proyecto',[
            'titulo' => $nombreProyecto
        ]);
    }

    public static function perfil(Router $router)
    {
        session_start(); // Iniciamos la sesion que se creo al momento del login
        isAuth();
        $alertas = [];

        $usuario = Usuario::find($_SESSION['id']);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validar_perfil();

            if (empty($alertas)) {
                // Verificar que email no exista
                $existeUsuario = Usuario::where('email', $usuario->email);

                if ($existeUsuario && $existeUsuario->id !== $usuario->id) {
                    // Mensaje de error
                    Usuario::setAlerta('error', 'Email no valido, Cuenta registrada');
                    $alertas = $usuario->getAlertas();
                } else {
                    // Guardar el usuario
                    $usuario->guardar();

                    Usuario::setAlerta('exito', 'Guardado Correctamente');
                    $alertas = $usuario->getAlertas();

                    // Asginar el nombre nuevo a la barra
                    $_SESSION['nombre'] = $usuario->nombre;
                }
            }
        }

        $router->render('dashboard/perfil',[
            'titulo' => 'Perfil',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function cambiar_password(Router $router)
    {
        session_start();
        isAuth();
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = Usuario::find($_SESSION['id']);

            // Sincrionizar el Constructor con el POST Actual
            $usuario->sincronizar($_POST);

            $alertas = $usuario->nuevo_password();

            if (empty($alertas)) {
                $resultado = $usuario->comprobar_password();

                if ($resultado) {
                    // Asignar el nuevo password
                    $usuario->password = $usuario->password_nuevo;
                    // Lipieza de propiedades ya procesadas
                    $usuario->password_actual = '';
                    $usuario->password_nuevo = '';

                    // Hashear nuevo password
                    $usuario->hashPassword();

                    // Actualizar
                    $resultado = $usuario->guardar();

                    if ($resultado) {
                        Usuario::setAlerta('exito', 'Password Guardado Correctamente');
                        $alertas = $usuario->getAlertas();
                    }

                } else {
                    // Metemos las alertas al arreglo
                    Usuario::setAlerta('error', 'Password Incorrecto');
                    // este jala las alertas del arreglo y las retorna
                    $alertas = $usuario->getAlertas();
                }
            }
        }

        $router->render('dashboard/cambiar-password', [
            'titulo' => 'Cammbiar Password',
            'alertas' => $alertas
        ]);
    }

}
