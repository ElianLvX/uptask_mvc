<?php include_once  __DIR__ . '/header-dashboard.php'?>

<?php if (count($proyectos) === 0) { ?>
    <p class="no-proyectos">No hay Proyectos Aún <a href="/crear-proyecto">Comiezan Creando Uno.</a></p>
<?php } else { ?>
    <ul class="listado-proyectos">
        <?php foreach ($proyectos as $proyecto) : ?>
            <li class="proyecto">
                <a href="/proyecto?id=<?= $proyecto->url; ?>">
                    <?php echo $proyecto->proyecto; ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
<?php } ?>

<?php include_once  __DIR__ . '/footer-dashboard.php'?>