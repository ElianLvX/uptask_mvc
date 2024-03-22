!function(){!async function(){try{const t="/api/tarea?id="+i(),a=await fetch(t),n=await a.json();e=n.tareas,o()}catch(e){console.log(e)}}();let e=[],t=[];document.querySelector("#agregar-tarea").addEventListener("click",(function(){n()}));function a(a){const n=a.target.value;"1"===n||"0"===n?(t=e.filter(e=>e.estado===n),0===t.length&&t.push(n)):t=[],o()}function o(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const t=e.filter(e=>"0"===e.estado),a=document.querySelector("#pendientes");0===t.length?a.disabled=!0:a.disabled=!1}(),function(){const t=e.filter(e=>"1"===e.estado),a=document.querySelector("#completadas");0===t.length?a.disabled=!0:a.disabled=!1}(),miValor="0"===t[0]||"1"===t[0]?[]:t;const a=t.length?miValor:e;if(0===a.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("LI");return t.textContent="No Hay Tareas",t.classList.add("no-tareas"),void e.appendChild(t)}const d={0:"Pendiente",1:"Completa"};a.forEach(t=>{const a=document.createElement("LI");a.dataset.tareaId=t.id,a.classList.add("tarea");const s=document.createElement("P");s.textContent=t.nombre,s.ondblclick=function(){n(!0,{...t})};const l=document.createElement("DIV");l.classList.add("opciones");const u=document.createElement("BUTTON");u.classList.add("estado-tarea"),u.classList.add(""+d[t.estado].toLowerCase()),u.textContent=d[t.estado],u.dataset.estadoTarea=t.estado,u.ondblclick=function(){!function(e){const t="1"===e.estado?"0":"1";e.estado=t,c(e)}({...t})};const m=document.createElement("BUTTON");m.classList.add("eliminar-tarea"),m.dataset.idTarea=t.id,m.textContent="Eliminar",m.ondblclick=function(){!function(t){Swal.fire({title:"¿Eliminar Tarea?",text:"¿Estas Seguro? esta Opcion es Irreversible!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, Eliminalo!",cancelButtonText:"No"}).then(a=>{a.isConfirmed&&async function(t){const{estado:a,id:n,nombre:c,proyectoId:d}=t,s=new FormData;s.append("id",n),s.append("nombre",c),s.append("estado",a),s.append("proyectoId",i());try{const a="http://uptask.localhost/api/tarea/eliminar",n=await fetch(a,{method:"POST",body:s}),c=await n.json();c.resultado&&(Swal.fire({title:"Eliminado!",text:c.mensaje,icon:"success"}),ubicacionAlerta=document.querySelector(".contenedor-nueva-tarea"),r(c.mensaje,c.tipo,ubicacionAlerta),e=e.filter(e=>e.id!==t.id),o())}catch(e){console.log(e)}}(t)})}({...t})},l.appendChild(u),l.appendChild(m),a.appendChild(s),a.appendChild(l);document.querySelector("#listado-tareas").appendChild(a)})}function n(t=!1,a={}){console.log(a),console.log(t);const n=document.createElement("DIV");n.classList.add("modal"),n.innerHTML=`\n            <form class="formulario nueva-tarea">\n                <legend>${t?"Editar Tarea":"Añade una nueva tarea"}</legend>\n                <div class="campo">\n                    <label for="tarea">Tarea : </label>\n                    <input \n                        type="text"\n                        name="tarea"\n                        placeholder="${t?"Edita la Tarea":"Agregar una nueva tarea"}"\n                        value="${a.nombre?a.nombre:""}"\n                        id="tarea"    \n                    >\n                </div>\n                \n                <div class="opciones">\n                    <input type="submit" class="submit-nueva-tarea" value="${t?"Actualizar Tarea":"Añadir Tarea"}">\n                    <button type="button" class="cerrar-modal">Cancelar</button>\n                </div>\n            </form>\n        `,setTimeout(()=>{document.querySelector(".formulario").classList.add("animar")},200),n.addEventListener("click",(function(d){if(d.preventDefault(),d.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout(()=>{n.remove()},500)}if(d.target.classList.contains("submit-nueva-tarea")){const n=document.querySelector("#tarea").value.trim();if(""===n){return void r("El Nombre de la tarea es Obligatorio","error",document.querySelector(".formulario legend"))}t?(a.nombre=n,c(a)):async function(t){const a=new FormData;a.append("nombre",t),a.append("proyectoId",i());try{const n="http://uptask.localhost/api/tarea",c=await fetch(n,{method:"POST",body:a}),i=await c.json();let d=document.querySelector(".formulario legend");if(r(i.mensaje,i.tipo,d),"exito"===i.tipo){const a=document.querySelector(".modal");setTimeout(()=>{a.remove()},2500);const n={id:String(i.id),nombre:t,estado:"0",proyectoId:i.proyectoId};e=[...e,n],o()}}catch(e){console.log(e)}}(n)}})),document.querySelector(".dashboard").appendChild(n)}function r(e,t,a){const o=document.querySelector(".alerta");o&&o.remove();const n=document.createElement("DIV");n.classList.add("alerta",t),n.textContent=e,a.parentElement.insertBefore(n,a.nextElementSibling),setTimeout(()=>{n.remove()},4e3)}async function c(t){const{estado:a,id:n,nombre:r,proyectoId:c}=t,d=new FormData;d.append("id",n),d.append("nombre",r),d.append("estado",a),d.append("proyectoId",i());try{const t="http://uptask.localhost/api/tarea/actualizar",c=await fetch(t,{method:"POST",body:d}),i=await c.json();if(ubicacionAlerta=document.querySelector(".contenedor-nueva-tarea"),"exito"===i.respuesta.tipo){Swal.fire({title:i.respuesta.mensaje,icon:"success"});const t=document.querySelector(".modal");t&&t.remove(),e=e.map(e=>(e.id===n&&(e.estado=a,e.nombre=r),e)),o()}}catch(e){console.log(e)}}function i(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).id}document.querySelectorAll('#filtros input[type="radio"]').forEach(e=>{e.addEventListener("input",a)})}();