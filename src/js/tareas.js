(function () { // IIEF Esta sintacys no permite que las variables salgan de este archivo y se autoInvoca
    // Boton para mostrar el modal de Agregar Tarea

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    /*
        Nota 1 : Nunca modificar(Mutar) la varioble o Objeto que contiene la respuesta de el servidor
               es mejor hacer la talacha y agregar lo que se necesite, no es una buena practica
               alterar lo que viene del servidor. lo que viene del serviddor practicamente es un
               estado actual de nuestra aplicacion y es buena practica mantenerlo intacto
               es decir podemos hacer Index, Create pero no Delete o Update es un poco ambiguo lo que
               acabo de escribir pero masomenos asi lo entiendo

        Nota 2 : Virtual DOM en este archivo se utilizo el Virtual DOM para evitar hacer una consulta
                 extra al servidor bastante interesante la verdad toda la logica esta en el metodo
                 agregarTareas() y en el objeto que esta dentro de ese metodo que se llama tareaObj
                 verificar ese metodo alli esta todo el contexto bastante interesante.
                 lo que entendi es que sirve para hacerlo reactivo y tambien evita sobre cargar
                 al servidor(Backend) ahora el cliente(FrontEnd) se encarga de mostrar el nuevo dato.

    */

    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    // Ya que este evento no se le esta pasando un call back se le esta pasando un metodo
    // esta funcion(mostrarFormulario) al no tener parentesis al momento de
    nuevaTareaBtn.addEventListener('click', function () {
        mostrarFormulario()
    });

    // Filtros de busqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio"]');
    filtros.forEach( radio => { // Iteramos por que al usar querySelectorAll no se puede agregar eventos
        // Al no poner parentesis se le pasa event o e automaticamente y lo podemos usar donde se crea la funcion
        radio.addEventListener('input', filtrarTareas);
    });

    function filtrarTareas (e) {
        const filtro = e.target.value;

        if (filtro === '1' || filtro === '0') {
            filtradas = tareas.filter(tarea => tarea.estado === filtro);
            filtradas.length === 0 && filtradas.push(filtro);
        } else {
            filtradas = [];
        }

        mostrarTareas();
    }


    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tarea?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            tareas = resultado.tareas;
            mostrarTareas();
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        limpiarTareas();
        totalPendientes();
        totalCompletadas();

        miValor = filtradas[0] === '0' || filtradas[0] === '1' ? [] : filtradas;

        const arrayTareas = filtradas.length ? miValor : tareas;

        if (arrayTareas.length === 0) {
            // Cuando no existan tareas
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No Hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }

        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        };

        arrayTareas.forEach(tarea => { // Itera todas las tareas
            const contenedorTarea = document.createElement('LI');// * Scritiong
            contenedorTarea.dataset.tareaId = tarea.id; // * Atributo personalizado datasets Investigar si dudas
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P'); // * Scritiong
            nombreTarea.textContent = tarea.nombre;
            nombreTarea.ondblclick = function () {
                // Se le pasa la tarea en la iteracion actual
                mostrarFormulario(true, {...tarea}); // Pasamos Una Copia del Original
            }

            // Div
            const opcionesDiv = document.createElement('DIV');// * Scritiong
            opcionesDiv.classList.add('opciones');

            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');// * Scritiong
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`) // El estado en minuscula
            // Con estados mostramos el texto dependiendo si hay un 0 o 1 en la bd
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.estadoTarea = tarea.estado;
            btnEstadoTarea.ondblclick = function () {
                // le pasamos las tareas que se estan iterando en ese momento
                /*
                 Importante se le pasa una copia del objeto actual que se esta iterando para evitar
                 mutar(cambiar) el objeto original, hacerlo de esta manera es una buena practica
                 ya que el objeto original nos da un estado actual de nuestra app

                 Explicacion del siguiente paso dentro de el metodo
                */
                cambiarEstadoTarea({...tarea});
            }

            const btnEliminarTarea = document.createElement('BUTTON');// * Scritiong
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.ondblclick = function () { // Boton Eliminar Logica
                confirmarEliminarTarea({...tarea});
            }

            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);

            contenedorTarea.appendChild(nombreTarea);// Agrego el Parrafo nombre de la tarea
            contenedorTarea.appendChild(opcionesDiv); // agrego el Div que contiene l   os Button

            const listadoTareas = document.querySelector('#listado-tareas');
            listadoTareas.appendChild(contenedorTarea);
        });
    }

    function totalPendientes() {
        const totalPendientes = tareas.filter(tarea => tarea.estado === '0');
        const pendientesRadio = document.querySelector('#pendientes');

        if (totalPendientes.length === 0) {
            pendientesRadio.disabled = true;
        } else {
            pendientesRadio.disabled = false;
        }
    }

    function totalCompletadas() {
        const totalCompletadas = tareas.filter(tarea => tarea.estado === '1');
        const completadasRadio = document.querySelector('#completadas');

        if (totalCompletadas.length === 0) {
            completadasRadio.disabled = true;
        } else {
            completadasRadio.disabled = false;
        }
    }

    function mostrarFormulario (editar = false, tarea = {}) {
        console.log(tarea);
        console.log(editar); // esta impresion explica el metodo sin parentesis mostrarFormulario
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>
                <div class="campo">
                    <label for="tarea">Tarea : </label>
                    <input 
                        type="text"
                        name="tarea"
                        placeholder="${editar ? 'Edita la Tarea' : 'Agregar una nueva tarea'}"
                        value="${tarea.nombre ? tarea.nombre : ''}"
                        id="tarea"    
                    >
                </div>
                
                <div class="opciones">
                    <input type="submit" class="submit-nueva-tarea" value="${editar ? 'Actualizar Tarea' : 'Añadir Tarea'}">
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `;
        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
        },200);

        // Delegation : basicamente este permitira agregar Eventos a lineas html que fueron creadas con innerHtml con JS
        // Cuando se utiliza scripting es decir CreateElement para meter lineas html el Delegation no se Usa
        modal.addEventListener('click', function (e) {
            e.preventDefault();

            if (e.target.classList.contains('cerrar-modal')) {
                /*
                    OJO AQUI se esta seleccionando la clase .formulario del formulario generado con innerHTML
                    lo que no deberia de pasar segun el codigo y el comentario que trae el Delegation
                    lo que esta ocurriendo se le llamaModelo de Concurrencia y Loop de Eventos
                    es una pregunta para Sinior developer en JS
                */
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => {
                    // Remueve por completo lo que se le halla asignado a la variable modal
                    modal.remove();
                }, 500);
            }
            if (e.target.classList.contains('submit-nueva-tarea')) {
                // trim quita espacios en blanco al inicio y al final
                // Aqui estamos seleccionando el input que tiene el id = tarea
                // Recordando que el input se construllo al vuelo no esta escrito como tal ya que se inserto arrriva
                const nombreTarea = document.querySelector('#tarea').value.trim();


                if (nombreTarea === '') { // Si esta vacio Inyectamos la validacion
                    // Mostrar una alerta de error
                    // Referencia de donde se insertara el div de la alerta
                    let referencia = document.querySelector('.formulario legend');
                    mostrarAlerta('El Nombre de la tarea es Obligatorio', 'error', referencia);
                    return;
                }

                if (editar) {
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea);
                } else {
                    agregarTarea(nombreTarea);
                }
            }
        })

        document.querySelector('.dashboard').appendChild(modal);
    }

    // Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia) {
        // Previene la creacion de multiples alertas
        const alertaPrevia = document.querySelector('.alerta');
        if (alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo); // se agregaran las clases 'alerta' y 'error'
        alerta.textContent = mensaje; // Como contenido del div le ponemos el texto que tiene mensaje
        // Inserta la alerta antes del legend
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 4000)
    }

    // Consultar el servidor para añadir una nueva tarea al proyecto actual
    async function agregarTarea(tarea) {
        // Construir la peticion
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());

        try {
            // Si este bloque falla entra el catch
            const url = 'http://uptask.localhost/api/tarea';
            const respuesta = await fetch(url, {
                method: 'POST',
                body : datos
            });
            // Si este bloque falla entra el catch

            // .json es un metodo que trae la variable respuesta al usar FETCH
            // Este segundo await no se va a ejecutar hasta que el primer await termine(donde trae el fetch)
            const resultado = await respuesta.json();
            // En este caso seria un error pero por que esta en esta parte de try?
            // Es un error creado por nosotros es decir no existe en nuestra BD
            // el catch solo se accionara si hubo algun error al conectar con la BD
            let referencia = document.querySelector('.formulario legend');
            mostrarAlerta(resultado.mensaje, resultado.tipo, referencia);

            // Borrar el Modal solo cuando la respuesta del backend sea exitosa
            if (resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                }, 2500);

                // Agregar el objeto de tarea al global de tareas
                const tareaObj = {
                    id: String(resultado.id), // Return de la api al crear la tarea
                    nombre: tarea, // Esto es del Input con el id = tarea
                    estado: "0", // dato duro
                    proyectoId: resultado.proyectoId // Return de la api al crear la tarea
                }

                /*
                Tema Virtual DOM
                 Al implementar esto Omitimos un Llamado al servidor al momento de agregar la tarea
                 es decir el proceso seria agrego tarea esta ya es una llamada al servidor
                 despues de agregar la tarea tengo que refrescar la interfaz con lo que se agrego pero
                 gracias a estos movimientos en el DOM ya se omite esta llamada al servidor

                 - 1 .- Creamos una tarea - Llamamos al Servidor para almacenarla
                 - 2 .- Guardamos lo que nos retorna el Servidor en el arreglo global
                 Cundo entramos a las tareas del proyecto se consultoa a la API(bd) y los guardamos el tareas la variable global
                 - 3 .- Copiamos lo que tiene la variable global(tareas) y le metemos el objeto que formamos
                        con lo que nos retorno el servidor.
                 - 4 .- Ahora ya tenemos los registros actuales y el nuevo registro creado en nuestro
                        variable global(tareas) lo pintamos con mostrarTareas.
                  En el paso 4 sin usar el metodo que se iso se tendria que volver a consultar
                  la BD para que nos traiga todos los registros con el que acabamos de registrar
                  eso es lo que nos estamos ahorrando una consulta al servidor. :)
                 */
                // Crea una copia del Arreglo que esta en global que ese ya tiene los registros de la BD
                // y con la siguiente linea agrega tareaObj es decir no esta consultando la BD al momento

                /*
                Por que no se utiliza
                -> tareas.push(tareaObj) Por que se estaria modificando el objeto original

                lo que se esta haciendo aqui -> tareas = [...tareas, tareaObj];
                sobre escribir el objeto original con una copia de lo que ya tiene
                pero agregando el nuevo objeto, hasta aqui no se a mutado nada de lo que ya
                contenia el objeto Original que teniamos solo se le agrego algo.
                 */
                tareas = [...tareas, tareaObj];
                mostrarTareas(); // este es el que pinta el arreglo global en el DOM
            }
        } catch (error) {
            console.log(error);
        }
    }

    function cambiarEstadoTarea(tarea) {
        // Evaluamos con este ternario el estado actual de la tarea
        const nuevoEstado = tarea.estado === '1' ? '0' : '1';
        tarea.estado = nuevoEstado; // Asignamos el Nuevo estado a la tarea Copia del Objeto Original
        actualizarTarea(tarea); // se le esta pasando ya la tarea modificada

        // console.log(tarea); // Este Imprime el la Iteracion del Objeto Copia
         // console.log(tareas); // Este es el Objeto original, no se a cambiado nada (Excelente)
    }

    async function actualizarTarea(tarea) {
        // hasta aqui es la tarea que se le enviara al servidor para integrarla.
        // Destructuring extraemos los valores y creamos las variables en una sola linea
        const {estado, id, nombre, proyectoId} = tarea;

        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto()); // En realidad es la URL del Proyecto

        try {
            const url = 'http://uptask.localhost/api/tarea/actualizar';

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();

            ubicacionAlerta = document.querySelector('.contenedor-nueva-tarea');

            if (resultado.respuesta.tipo === 'exito') {
                Swal.fire({
                    title: resultado.respuesta.mensaje,
                    icon: "success"
                });

                const modal = document.querySelector('.modal');
                // Se necesita el if por que en caso de que no exista la ventana modal marcara error
                // y no proseguira con el demas codigo es como un isset en php
                if (modal) {
                    modal.remove();
                }

                // Itera el arreglo original y crea un nuevo arreglo para evitar mutar usamos eso
                tareas = tareas.map(tareaMemoria => {
                    // id y tarea son variables del destructuring que estan al inicio del metodo
                    if (tareaMemoria.id === id) {
                        tareaMemoria.estado = estado;
                        tareaMemoria.nombre = nombre;
                    }
                    return tareaMemoria;
                });
                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
        }
        // Como ver los datos agregados a un FormData Awevo se tiene que Iterar la verdad que mamada
        /*
        for (let valor of datos.values()) {
            console.log(valor);
        }
        */
    }

    function confirmarEliminarTarea (tarea) {
        /*
        const respuesta = confirm('Deseas Eliminar?');
        console.log(respuesta);
         */
        Swal.fire({
            title: "¿Eliminar Tarea?",
            text: "¿Estas Seguro? esta Opcion es Irreversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminalo!",
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            }
        });
    }

    async function eliminarTarea(tarea) {
        const {estado, id, nombre, proyectoId} = tarea;

        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto()); // En realidad es la URL del Proyecto

        try {
            const url = 'http://uptask.localhost/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();
            if (resultado.resultado) {
                Swal.fire({
                    title: "Eliminado!",
                    text: resultado.mensaje,
                    icon: "success"
                });
                ubicacionAlerta = document.querySelector('.contenedor-nueva-tarea');
                mostrarAlerta(resultado.mensaje,resultado.tipo, ubicacionAlerta);

                // Recorre el arreglo original excepto la tarea que se le acaba de dar click que esta en tarea(es el parametro)
                tareas = tareas.filter( tareaMemoria => tareaMemoria.id !== tarea.id); // tareas es el array global
                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
        }
    }

    function obtenerProyecto() {
        // Esta obtendra las variables que estan en la URL
        const proyectoParams = new URLSearchParams(window.location.search);
        // Este lo itera para que solo agarre las variables y las mete en un objeto
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.id;
    }

    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');

        while(listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }

})();