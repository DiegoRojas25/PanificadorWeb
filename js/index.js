const taskManager = new TaskManager();
console.log("Instancia de TaskManager inicializada:", taskManager.tasks);

const tituloInput = document.querySelector("#inpTitulo");
const descripcionInput = document.querySelector("#inpDesc");
const fechaInput = document.querySelector("#inpFecha");
const alertaError = document.querySelector("#alertaError");
const formTarea = document.querySelector("#formTarea");
const contenedorLista = document.querySelector("#contenedorLista");

const btnFiltroTodas = document.querySelector("#btnFiltroTodas");
const btnFiltroPendientes = document.querySelector("#btnFiltroPendientes");
const btnFiltroCompletadas = document.querySelector("#btnFiltroCompletadas");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

let filtroActual = "todas";

const mapaPrioridades = {
    radAlta: { texto: "Alta", clase: "badge-alta" },
    radMedia: { texto: "Media", clase: "badge-media" },
    radBaja: { texto: "Baja", clase: "badge-baja" }
};

function validFormFieldInput(data) {
    const errores = [];
    
    if (!data.titulo.trim()) {
        errores.push("El título es obligatorio.");
    }
    if (!data.descripcion.trim()) {
        errores.push("La descripción es obligatoria.");
    }
    if (!data.fecha) {
        errores.push("Debes seleccionar una fecha límite.");
    }
    if (!data.prioridadId) {
        errores.push("Debes seleccionar una prioridad.");
    }

    return errores;
}

formTarea.addEventListener("submit", (e) => {
    e.preventDefault();

    const radioSeleccionado = document.querySelector('input[name="prioridad"]:checked');
    const prioridadId = radioSeleccionado ? radioSeleccionado.id : "";

    const data = {
        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        fecha: fechaInput.value,
        prioridadId: prioridadId
    };

    const errores = validFormFieldInput(data);

    if (errores.length > 0) {
        alertaError.classList.remove("d-none");
        alertaError.innerHTML = errores.join("<br>");
        return;
    }

    alertaError.classList.add("d-none");

    const nuevaTarea = taskManager.addTask(
        data.titulo,
        data.descripcion,
        data.fecha,
        data.prioridadId
    );

    console.log("Tarea agregada exitosamente a TaskManager:", nuevaTarea);
    console.log("Colección completa de tasks:", taskManager.tasks);

    crearTarjetaEnDOM(nuevaTarea);

    formTarea.reset();

    verificarTareasVencidas();
    actualizarEstadisticas();
    aplicarFiltro(filtroActual);
});

function crearTarjetaEnDOM(tarea) {
    const infoPrioridad = mapaPrioridades[tarea.priority] || { texto: "Baja", clase: "badge-baja" };

    const tarjetaDiv = document.createElement("div");
    tarjetaDiv.className = "card card-tarea mb-3";
    tarjetaDiv.id = `tarea-${tarea.id}`;

    tarjetaDiv.innerHTML = `
        <div class="d-flex align-items-start">
            <input class="form-check-input mt-1 me-3 chk-tarea" type="checkbox" id="chk-${tarea.id}">
            <div class="w-100">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="mb-0 fw-bold">${tarea.name}</h6>
                    <span class="badge-prioridad ${infoPrioridad.clase}">${infoPrioridad.texto}</span>
                </div>
                <p class="text-muted small mb-1">${tarea.description}</p>
                <p class="text-muted small mb-0"><i class="fa-regular fa-calendar me-1"></i> ${tarea.dueDate}</p>
            </div>
        </div>
    `;

    contenedorLista.appendChild(tarjetaDiv);
}

function verificarTareasVencidas() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const tarjetas = document.querySelectorAll(".card-tarea");

    tarjetas.forEach((tarjeta) => {
        const fechaElemento = tarjeta.querySelector(".fa-calendar");
        if (!fechaElemento) return;

        const fechaTexto = fechaElemento.nextSibling.textContent.trim();
        if (!fechaTexto) return;

        const [anio, mes, dia] = fechaTexto.split("-");
        const fechaLimite = new Date(anio, mes - 1, dia);

        const chk = tarjeta.querySelector(".chk-tarea");
        const contenedorHeader = tarjeta.querySelector(".d-flex.align-items-center.gap-2");
        let badgeVencida = contenedorHeader.querySelector(".badge-vencida");

        if (fechaLimite < hoy && !chk.checked) {
            tarjeta.classList.add("tarea-vencida");

            if (!badgeVencida) {
                badgeVencida = document.createElement("span");
                badgeVencida.className = "badge-prioridad badge-vencida";
                badgeVencida.textContent = "Vencida";
                contenedorHeader.appendChild(badgeVencida);
            }
        } else {
            tarjeta.classList.remove("tarea-vencida");
            if (badgeVencida) {
                badgeVencida.remove();
            }
        }
    });
}

function actualizarEstadisticas() {
    const tarjetas = document.querySelectorAll(".card-tarea");
    
    let total = tarjetas.length;
    let completadas = 0;
    let pendientes = 0;
    let expiradas = 0;

    tarjetas.forEach((tarjeta) => {
        const chk = tarjeta.querySelector(".chk-tarea");
        const esVencida = tarjeta.classList.contains("tarea-vencida");

        if (chk.checked) {
            completadas++;
        } else if (esVencida) {
            expiradas++;
        } else {
            pendientes++;
        }
    });

    document.querySelector("#lblTotal").textContent = total;
    document.querySelector("#resCompletadas").textContent = completadas;
    document.querySelector("#resPendientes").textContent = pendientes;
    document.querySelector("#resExpiradas").textContent = expiradas;

    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    
    const txtPorcentaje = document.querySelector("#txtPorcentaje");
    const graficoProgreso = document.querySelector("#graficoProgreso");

    if (txtPorcentaje) {
        txtPorcentaje.textContent = `${porcentaje}%`;
    }

    if (graficoProgreso) {
        graficoProgreso.style.background = `conic-gradient(var(--color-naranja) ${porcentaje}%, #354a63 0deg)`;
    }
}
function aplicarFiltro(tipoFiltro) {
    filtroActual = tipoFiltro;
    const tarjetas = document.querySelectorAll(".card-tarea");

    tarjetas.forEach((tarjeta) => {
        const chk = tarjeta.querySelector(".chk-tarea");

        switch (tipoFiltro) {
            case "completadas":
                tarjeta.style.display = chk.checked ? "block" : "none";
                break;
            case "pendientes":
                tarjeta.style.display = !chk.checked ? "block" : "none";
                break;
            case "todas":
            default:
                tarjeta.style.display = "block";
                break;
        }
    });
    verificarEstadoVacio();
}

btnFiltroTodas?.addEventListener("click", () => {
    activarBotonFiltro(btnFiltroTodas);
    aplicarFiltro("todas");
});

btnFiltroPendientes?.addEventListener("click", () => {
    activarBotonFiltro(btnFiltroPendientes);
    aplicarFiltro("pendientes");
});

btnFiltroCompletadas?.addEventListener("click", () => {
    activarBotonFiltro(btnFiltroCompletadas);
    aplicarFiltro("completadas");
});

function activarBotonFiltro(botonActivo) {
    botonesFiltro.forEach((btn) => btn.classList.remove("active"));
    botonActivo.classList.add("active");
}

contenedorLista.addEventListener("change", (event) => {
    if (event.target.classList.contains("chk-tarea")) {
        const tarjetaTarea = event.target.closest(".card-tarea");
        
        tarjetaTarea.classList.toggle("tarea-completada", event.target.checked);
        
        verificarTareasVencidas();
        actualizarEstadisticas();
        aplicarFiltro(filtroActual);
    }
});

function verificarEstadoVacio() {
    const tarjetas = document.querySelectorAll(".card-tarea");
    const msgSinTareas = document.querySelector("#sinTareasMsg");

    if (!msgSinTareas) return;

    let tareasVisibles = 0;
    tarjetas.forEach((tarjeta) => {
        if (tarjeta.style.display !== "none") {
            tareasVisibles++;
        }
    });

    if (tareasVisibles === 0) {
        msgSinTareas.classList.remove("d-none");
    } else {
        msgSinTareas.classList.add("d-none");
    }
}

verificarTareasVencidas();
actualizarEstadisticas();
aplicarFiltro("todas");
verificarEstadoVacio();