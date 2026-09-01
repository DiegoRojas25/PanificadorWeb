const tituloInput = document.querySelector("#inpTitulo");
const descripcionInput = document.querySelector("#inpDesc");
const fechaInput = document.querySelector("#inpFecha");
const alertaError = document.querySelector("#alertaError");
const formTarea = document.querySelector("#formTarea"); 


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

    const prioridadSeleccionada = document.querySelector('input[name="prioridad"]:checked').id;

    const data = {
        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        fecha: fechaInput.value,
        prioridad: prioridadSeleccionada
    };

    const errores = validFormFieldInput(data);

    if (errores.length > 0) {

        alertaError.classList.remove("d-none");
        alertaError.innerHTML = errores.join("<br>");
        return;
    }

    alertaError.classList.add("d-none");
    console.log("Formulario válido. Datos:", data);
    
});