<div class="contenedor reestablecer">

    <?php include_once __DIR__ . "/../templates/nombre-sitio.php"; ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Coloca tu nuevo password</p>

        <?php include_once __DIR__ . "/../templates/alertas.php"; ?>

        <?php if ($mostrar) : ?>
            <form class="formulario" method="POST"> <!-- No lleva Action por que se pierde la referencia del Token que trae la URL -->
                <div class="campo">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Tu Password" name="password" />
                </div>

                <input type="submit" class="boton" value="Guardar Password">
            </form>
        <?php endif; ?>

        <div class="acciones">
            <a href="/crear">¿Aún no tienes cuenta? Obtener Una.</a>
            <a href="/">¿Ya tienes una cuenta? Inicia Sesión.</a>
        </div>
    </div><!-- contenedor-sm -->
</div>