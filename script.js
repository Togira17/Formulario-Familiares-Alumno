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

// Función para recopilar datos del formulario
function recopilarDatosFormulario() {
    // Implementar recopilación de datos
    const formData = {
        // ... recopilar todos los campos del formulario
    };
    return formData;
}

// Inicializar todo al cargar la página
window.addEventListener('DOMContentLoaded', cargarDatos);