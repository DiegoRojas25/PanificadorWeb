const tituloInput = document.querySelector("#titulo");
const descripcionInput = document.querySelector("#descripcion");
const fechaInput = document.querySelector("#fecha");
const btnAgregarTarea = document.querySelector("#btnAgregarTarea");
const alertaError = document.querySelector("#alertaError");
const botonesPrioridad = document.querySelectorAll(".priority-button");

let prioridadSeleccionada = "";

botonesPrioridad.forEach(boton => {

    boton.addEventListener("click", () => {
        prioridadSeleccionada = boton.dataset.priority;
        console.log("Prioridad:", prioridadSeleccionada);
    });

});

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

btnAgregarTarea.addEventListener("click", () => {

    const data = {

        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        fecha: fechaInput.value,
        prioridad: prioridadSeleccionada

    };

    console.log(data);

    const errores = validFormFieldInput(data);

    if (errores.length > 0) {

        alertaError.classList.remove("d-none");
        alertaError.innerHTML = errores.join("<br>");

        return;
    }

    alertaError.classList.add("d-none");

    console.log("Formulario válido");

});