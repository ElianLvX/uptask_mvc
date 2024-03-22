# Apuntes de para el FrontEnd y El BackEnd de **UpTask MvC**

![Npm de JavaScript](https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/540px-Npm-logo.svg.png)
![Compositor de Php](https://getcomposer.org/img/logo-composer-transparent4.png)

### npm i: 
    El comando npm i es un alias para npm install. Esto significa que npm i package es lo mismo que npm install package.

### composer update: 
    Este comando se utiliza para actualizar las dependencias tal como se especifican en el archivo composer.json. En detalle, este comando:
    Lee el archivo composer.json.

    El comando composer update actualiza todas las dependencias del proyecto a sus últimas versiones (según lo especificado en composer.json), y luego actualiza el archivo composer.lock con las versiones exactas de los paquetes que se han instalado. Durante este proceso, también se genera el archivo de autocarga.

### composer install: 
    Este comando se utiliza para instalar todas las dependencias tal como se especifican en el archivo composer.lock

    Comprueba si existe el archivo composer.lock.
    Lee el archivo composer.lock.
    Instala los paquetes especificados en el archivo composer.lock.

    El comando composer install se utiliza para instalar las dependencias del proyecto tal como se especifican en el archivo composer.lock. Aquí están los pasos detallados de lo que hace este comando:

    Comprueba si existe el archivo composer.lock en el directorio del proyecto.
    Si el archivo composer.lock existe, composer install lee este archivo y descarga las versiones exactas de las dependencias que se especifican en él.
    Si el archivo composer.lock no existe, composer install actúa como composer update. Lee el archivo composer.json, resuelve las dependencias y escribe las versiones exactas en un nuevo archivo composer.lock.
    Después de resolver las dependencias, composer install descarga e instala las dependencias.
    Finalmente, composer install genera el archivo de autocarga (autoload), que se utiliza para cargar automáticamente las clases PHP en tu proyecto.
    Por lo tanto, composer install se utiliza principalmente para asegurar que todos los desarrolladores y los entornos de despliegue estén utilizando las mismas versiones exactas de las dependencias, tal como se especifican en el archivo composer.lock.