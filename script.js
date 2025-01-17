// Función para cargar los datos desde el JSON
async function cargarDatos() {
    try {
        const response = await fetch('datos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Inicializar todos los selectores
        inicializarSelectores(data);
        
        // Inicializar eventos de dirección
        inicializarSelectoresDireccion(data);
        
        // Inicializar manejo de familiares
        inicializarManejoFamiliares(data);
        
        // Inicializar validaciones
        inicializarValidaciones();

    } catch (error) {
        console.error('Error al cargar el JSON:', error);
        mostrarError('Error al cargar los datos. Por favor, recarga la página.');
    }
}

// Función para inicializar todos los selectores básicos
function inicializarSelectores(data) {
    const selectores = {
        'lenguaMaterna': { data: data.lenguasMaternas, multiple: false },
        'familiar-idioma-1': { data: data.lenguasMaternas, multiple: false },
        'idiomasConocidos': { data: data.idiomasConocidos, multiple: true },
        'nivelEstudios': { data: data.nivelesDeEstudio, multiple: false },
        'familiar-profesion-1': { data: data.profesiones, multiple: false },
        'familiar-ciudad-1': { data: data.ciudadesDeNacimiento, multiple: false },
        'familiar-lengua-1': { data: data.lenguasMaternas, multiple: false },
        'familiar-idiomas-1': { data: data.idiomasConocidos, multiple: true },
        'idiomasEstudiados': { data: data.idiomasConocidos, multiple: true},
        'nivelSolicitado': { data: data.nivelesDeEstudioSolicitados, multiple: false },
        'alergias': { data: data.alergias, multiple: true },
    };

    Object.entries(selectores).forEach(([id, config]) => {
        llenarOpciones(id, config.data, config.multiple);
    });
}

// Función mejorada para llenar las opciones de un select
function llenarOpciones(id, opciones, multiple = false) {
    const select = document.getElementById(id);
    if (!select) {
        console.warn(`Elemento con ID '${id}' no encontrado`);
        return;
    }

    // Limpiar opciones existentes
    select.innerHTML = '';
    
    // Añadir opción por defecto para selects simples
    if (!multiple) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione una opción';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
    }

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
    });

    if (multiple) {
        select.size = Math.min(opciones.length, 5);
    }
}

// Función para inicializar los selectores de dirección
function inicializarSelectoresDireccion(data) {
    const paisSelect = document.getElementById('pais');
    const ciudadSelect = document.getElementById('ciudad');
    const poblacionSelect = document.getElementById('poblacion');

    // Llenar países
    llenarOpciones('pais', Object.keys(data.paises));

    // Evento cambio de país
    paisSelect.addEventListener('change', () => {
        resetSelector(ciudadSelect, 'ciudad');
        resetSelector(poblacionSelect, 'población');

        const ciudades = data.paises[paisSelect.value]?.ciudades;
        if (ciudades) {
            llenarOpciones('ciudad', Object.keys(ciudades));
            ciudadSelect.disabled = false;
        }
    });

    // Evento cambio de ciudad
    ciudadSelect.addEventListener('change', () => {
        resetSelector(poblacionSelect, 'población');

        const poblaciones = data.paises[paisSelect.value]?.ciudades[ciudadSelect.value];
        if (poblaciones) {
            llenarOpciones('poblacion', poblaciones);
            poblacionSelect.disabled = false;
        }
    });
}

// Función para resetear un selector
function resetSelector(select, tipo) {
    select.innerHTML = `<option disabled selected>Seleccione una ${tipo}</option>`;
    select.disabled = true;
}

// Función para inicializar el manejo de familiares
function inicializarManejoFamiliares(data) {
    const addFamiliarBtn = document.getElementById('add-familiar');
    const familiaresContainer = document.getElementById('familiares-container');
    let familiarCount = 1;

    addFamiliarBtn.addEventListener('click', () => {
        familiarCount++;
        const nuevoFamiliar = crearNuevoFamiliar(familiarCount, data);
        familiaresContainer.appendChild(nuevoFamiliar);
        
        // Inicializar selectores del nuevo familiar
        llenarOpciones(`familiar-lengua${familiarCount}`, data.lenguasMaternas);
        llenarOpciones(`familiar-idiomas${familiarCount}`, data.idiomasConocidos, true);
        llenarOpciones(`familiar-profesion${familiarCount}`, data.profesiones);

        // Inicializar ciudad de nacimiento
        const ciudadNacimientoSelect = document.getElementById(`familiar-ciudad-${familiarCount}`);
        initializeCiudadNacimiento(ciudadNacimientoSelect, data.ciudadesDeNacimiento);
    });
}

// Función para crear un nuevo familiar
function crearNuevoFamiliar(index, data) {
    const div = document.createElement('div');
    div.className = 'familiar-entry';
    div.innerHTML = `
        <!-- Template HTML para nuevo familiar -->
        <button type="button" class="remove-familiar" onclick="this.parentElement.remove()">
            Eliminar Familiar
        </button>
        <!-- ... resto del HTML para el familiar ... -->
    `;
    return div;
}

// Función para inicializar validaciones
function inicializarValidaciones() {
    const form = document.getElementById('studentRegistrationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validarFormulario()) {
            try {
                const formData = recopilarDatosFormulario();
                const alumno = AlumnoDirector.createAlumno(formData);
                console.log('Alumno creado exitosamente:', alumno);
                // Aquí puedes enviar los datos al servidor
            } catch (error) {
                console.error('Error al crear alumno:', error);
                mostrarError(error.message);
            }
        }
    });
}

// Función para validar el formulario
function validarFormulario() {
    // Implementar validaciones específicas
    const familiares = document.querySelectorAll('.familiar-entry');
    if (familiares.length === 0) {
        mostrarError('Debe añadir al menos un familiar');
        return false;
    }
    
    // Más validaciones...
    return true;
}

// Función para mostrar errores
function mostrarError(mensaje) {
    // Implementar visualización de errores
    alert(mensaje); // Esto debería mejorarse con una UI más amigable
}

function recopilarDatosFormulario() {
    // Datos personales del alumno
    const datosPersonales = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        nif: document.getElementById('nif').value,
        lenguaMaterna: document.getElementById('lenguaMaterna').value,
        idiomasConocidos: Array.from(document.getElementById('idiomasConocidos').selectedOptions).map(option => option.value)
    };

    // Recopilar datos de familiares
    const familiaresEntries = document.querySelectorAll('.familiar-entry');
    const familiares = Array.from(familiaresEntries).map(familiar => {
        const index = familiar.querySelector('[id^="familiar-nombre-"]').id.split('-').pop();
        return {
            nombre: document.getElementById(`familiar-nombre-${index}`).value,
            apellidos: document.getElementById(`familiar-apellidos-${index}`).value,
            nif: document.getElementById(`familiar-nif-${index}`).value,
            profesion: document.getElementById(`familiar-profesion-${index}`).value,
            ciudadNacimiento: document.getElementById(`familiar-ciudad-${index}`).value,
            lenguaMaterna: document.getElementById(`familiar-lengua-${index}`).value,
            idiomasConocidos: Array.from(document.getElementById(`familiar-idiomas-${index}`).selectedOptions).map(option => option.value)
        };
    });

    // Datos de dirección
    const direccion = {
        pais: document.getElementById('pais').value,
        ciudad: document.getElementById('ciudad').value,
        poblacion: document.getElementById('poblacion').value,
        direccionCompleta: document.getElementById('direccion').value,
        codigoPostal: document.getElementById('codigoPostal').value
    };

    // Datos académicos
    const datosAcademicos = {
        colegioProcedencia: document.getElementById('colegioProcedencia').value,
        nivelEstudios: document.getElementById('nivelEstudios').value,
        idiomasEstudiados: Array.from(document.getElementById('idiomasEstudiados').selectedOptions).map(option => option.value),
        nivelSolicitado: document.getElementById('nivelSolicitado').value
    };

    // Información médica (opcional)
    const informacionMedica = {
        alergias: Array.from(document.getElementById('alergias').selectedOptions).map(option => option.value),
        medicacion: document.getElementById('medicacion').value
    };

    // Convertir a formato legible para mostrar en modal
    const datosParaMostrar = {
        // Datos personales
        "Nombre": datosPersonales.nombre,
        "Apellidos": datosPersonales.apellidos,
        "NIF": datosPersonales.nif,
        "Lengua Materna": datosPersonales.lenguaMaterna,
        "Idiomas Conocidos": datosPersonales.idiomasConocidos.join(", "),

        // Datos del familiar
        "Familiar - Nombre": familiares[0].nombre,
        "Familiar - Apellidos": familiares[0].apellidos,
        "Familiar - NIF": familiares[0].nif,
        "Familiar - Profesión": familiares[0].profesion,
        "Familiar - Ciudad de Nacimiento": familiares[0].ciudadNacimiento,
        "Familiar - Lengua Materna": familiares[0].lenguaMaterna,
        "Familiar - Idiomas Conocidos": familiares[0].idiomasConocidos.join(", "),

        // Dirección
        "País": direccion.pais,
        "Ciudad": direccion.ciudad,
        "Población": direccion.poblacion,
        "Dirección": direccion.direccionCompleta,
        "Código Postal": direccion.codigoPostal,

        // Datos académicos
        "Colegio de Procedencia": datosAcademicos.colegioProcedencia,
        "Nivel de Estudios": datosAcademicos.nivelEstudios,
        "Idiomas Estudiados": datosAcademicos.idiomasEstudiados.join(", "),
        "Nivel Solicitado": datosAcademicos.nivelSolicitado,

        // Información médica
        "Alergias": informacionMedica.alergias.join(", ") || "Ninguna",
        "Medicación": informacionMedica.medicacion || "Ninguna"
    };

    // Mostrar los datos en el modal
    mostrarDatosEnModal(datosParaMostrar);
    
    // Devolver los datos estructurados para el objeto Alumno
    return {
        ...datosPersonales,
        familiares,
        direccion,
        datosAcademicos,
        informacionMedica: informacionMedica.alergias.length > 0 || informacionMedica.medicacion ? informacionMedica : null
    };
}
// Nueva función para mostrar los datos en el modal
function mostrarDatosEnModal(datos) {
    let contenidoModal = '';
    for (const [clave, valor] of Object.entries(datos)) {
        contenidoModal += `<div><strong>${clave}:</strong> ${valor}</div>`;
    }
    
    // Crear o actualizar el modal
    let modal = document.getElementById('modal-datos');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-datos';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 80vh;
            overflow-y: auto;
            z-index: 1000;
        `;
        
        // Añadir botón de cerrar
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            border: none;
            background: none;
            font-size: 20px;
            cursor: pointer;
        `;
        closeButton.onclick = () => modal.remove();
        modal.appendChild(closeButton);
    }

    // Añadir título
    const titulo = document.createElement('h2');
    titulo.textContent = 'Datos del Formulario';
    titulo.style.marginBottom = '20px';
    
    // Contenedor para los datos
    const contenedor = document.createElement('div');
    contenedor.style.cssText = `
        display: grid;
        gap: 10px;
    `;
    contenedor.innerHTML = contenidoModal;
    
    modal.appendChild(titulo);
    modal.appendChild(contenedor);
    document.body.appendChild(modal);
}
// Inicializar todo al cargar la página
window.addEventListener('DOMContentLoaded', cargarDatos);