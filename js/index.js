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
  if (!data.prioridad) {
    errores.push("Debes seleccionar una prioridad.");
  }

  return errores;
}

formTarea.addEventListener("submit", (e) => {
  e.preventDefault();

  const prioridadSeleccionada = document.querySelector(
    'input[name="prioridad"]:checked',
  ).id;

  const data = {
    titulo: tituloInput.value,
    descripcion: descripcionInput.value,
    fecha: fechaInput.value,
    prioridad: prioridadSeleccionada,
  };

  const errores = validFormFieldInput(data);

  if (errores.length > 0) {
    alertaError.classList.remove("d-none");
    alertaError.innerHTML = errores.join("<br>");
    return;
  }

  alertaError.classList.add("d-none");
  console.log("Formulario válido. Datos ingresados:", data);
});

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
    const contenedorHeader = tarjeta.querySelector(
      ".d-flex.align-items-center.gap-2",
    );
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

verificarTareasVencidas();
actualizarEstadisticas();
aplicarFiltro("todas");
