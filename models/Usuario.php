<?php

namespace Model;

class Usuario extends ActiveRecord
{
    protected static $tabla = 'usuarios';
    protected static $columnasDB = [
        'id',
        'nombre',
        'email',
        'password',
        'token',
        'confirmado'
    ];

    public $id;
    public $nombre;
    public $email;
    public $password;
    public $password2;
    public $password_actual;
    public $password_nuevo;
    public $token;
    public $confirmado;

    // Como tal el constructor es la forma del objeto mientras que la variable $columnasDB
    // eso es lo que deverdad se inserta en la base de datos el constructor le podemos agregar lo que sea o necesitemos.
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->password2 = $args['password2'] ?? '';
        $this->password_actual = $args['password_actual'] ?? '';
        $this->password_nuevo = $args['password_nuevo'] ?? '';
        $this->token = $args['token'] ?? '';
        $this->confirmado = $args['confirmado'] ?? 0; // Cero por que al momento de crear la cuenta no esta confirmado
    }

    // Validar cuenta nueva
    public function validarLogin() : array
    {
        if (!$this->email) {
            self::$alertas['error'][] = 'El email del usuario es Obligatorio';
        }

        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Email no valido';
        }

        if (!$this->password) {
            self::$alertas['error'][] = 'El password no puede ir vacio';
        }

        return self::$alertas;
    }

    // Validacion para cuentas nuevas
    public function validarNuevaCuenta() : array
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El nombre del usuario es Obligatorio';
        }

        if (!$this->email) {
            self::$alertas['error'][] = 'El email del usuario es Obligatorio';
        }

        if (!$this->password) {
            self::$alertas['error'][] = 'El password no puede ir vacio';
        }

        if (strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }

        if ($this->password !== $this->password2) {
            self::$alertas['error'][] = 'Los Password son diferentes';
        }

        return self::$alertas;
    }

    // valida un email
    public function validarEmail() : array
    {
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Email no valido';
        }
        return self::$alertas;
    }

    public function validarPassword() : array
    {
        if (!$this->password) {
            self::$alertas['error'][] = 'El password no puede ir vacio';
        }

        if (strlen($this->password) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }
        return self::$alertas;
    }

    public function validar_perfil() : array
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es obligatorio';
        }
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es obligatorio';
        }

        return self::$alertas;
    }
    // No se puede usar $this cuando la funcion es static
    public function nuevo_password() : array
    {
        if (!$this->password_actual) {
            self::$alertas['error'][] = 'El password Actual no puede ir vacio';
        }
        if (!$this->password_nuevo) {
            self::$alertas['error'][] = 'El password Nuevo no puede ir vacio';
        }
        if (strlen($this->password_nuevo) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }
        return self::$alertas;
    }

    public function comprobar_password() : bool
    {
        return password_verify($this->password_actual, $this->password);
    }

    // Hashea el Password
    public function hashPassword() : void
    {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    // Generar un Token
    public function crearToken() : void
    {
        /* 
            la funcion uniqid() No es muy segura, no es recomendado hashear passwords con ella
            pero para crear un token temporal es mas que sufiente, para este caso es UTIL.
        */
        $this->token = uniqid();
    }
}
