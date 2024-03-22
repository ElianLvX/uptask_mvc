<aside class="sidebar">
    <div class="contenedor-sidebar">
        <h2>UpTask</h2>

        <div class="cerrar-menu">
            <img id="cerrar-menu" src="build/img/cerrar.svg" alt="imagen cerrar menu">
        </div>
    </div>

    <nav class="sidebar-nav">
        <a class="<?= ($titulo === 'Proyectos') ? 'activo' : ''; ?>" href="/dashboard"> Proyectos </a>
        <a class="<?= ($titulo === 'Crear Proyectos') ? 'activo' : ''; ?>" href="/crear-proyecto"> Crear Proyecto </a>
        <a class="<?= ($titulo === 'Perfil') ? 'activo' : ''; ?>" href="/perfil"> Perfil </a>
    </nav>

    <div class="cerrar-sesion-mobile">
        <a href="/logout" class="cerrar-sesion"> Cerrar Sesión </a>
    </div>
</aside>
