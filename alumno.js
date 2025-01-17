// Clase para la información de Dirección
class Direccion {
    constructor(pais, ciudad, poblacion, direccionCompleta, codigoPostal) {
        this.pais = pais;
        this.ciudad = ciudad;
        this.poblacion = poblacion;
        this.direccionCompleta = direccionCompleta;
        this.codigoPostal = codigoPostal;
    }
}

// Clase para Familiar
class Familiar {
    constructor(nombre, apellidos, nif, profesion, ciudadNacimiento, lenguaMaterna, idiomasConocidos) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.nif = nif;
        this.profesion = profesion;
        this.ciudadNacimiento = ciudadNacimiento;
        this.lenguaMaterna = lenguaMaterna;
        this.idiomasConocidos = idiomasConocidos;
    }
}

// Clase para Datos Académicos
class DatosAcademicos {
    constructor(colegioProcedencia, nivelEstudios, idiomasEstudiados, nivelSolicitado) {
        this.colegioProcedencia = colegioProcedencia;
        this.nivelEstudios = nivelEstudios;
        this.idiomasEstudiados = idiomasEstudiados;
        this.nivelSolicitado = nivelSolicitado;
    }
}

// Clase para Información Médica
class InformacionMedica {
    constructor(alergias, medicacion) {
        this.alergias = alergias;
        this.medicacion = medicacion;
    }
}

// Clase principal Alumno
class Alumno {
    constructor(builder) {
        // Datos personales
        this.nombre = builder.nombre;
        this.apellidos = builder.apellidos;
        this.nif = builder.nif;
        this.lenguaMaterna = builder.lenguaMaterna;
        this.idiomasConocidos = builder.idiomasConocidos;
        
        // Objetos complejos
        this.familiares = builder.familiares;
        this.direccion = builder.direccion;
        this.datosAcademicos = builder.datosAcademicos;
        this.informacionMedica = builder.informacionMedica;
    }
}

// Builder para Alumno
class AlumnoBuilder {
    constructor() {
        this.reset();
    }

    reset() {
        // Datos personales
        this.nombre = '';
        this.apellidos = '';
        this.nif = '';
        this.lenguaMaterna = '';
        this.idiomasConocidos = [];
        
        // Arrays y objetos
        this.familiares = [];
        this.direccion = null;
        this.datosAcademicos = null;
        this.informacionMedica = null;
    }

    // Métodos para datos personales
    setDatosPersonales(nombre, apellidos, nif, lenguaMaterna, idiomasConocidos) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.nif = nif;
        this.lenguaMaterna = lenguaMaterna;
        this.idiomasConocidos = idiomasConocidos;
        return this;
    }

    // Método para añadir familiares
    addFamiliar(familiar) {
        this.familiares.push(familiar);
        return this;
    }

    // Método para establecer dirección
    setDireccion(direccion) {
        this.direccion = direccion;
        return this;
    }

    // Método para establecer datos académicos
    setDatosAcademicos(datosAcademicos) {
        this.datosAcademicos = datosAcademicos;
        return this;
    }

    // Método para establecer información médica
    setInformacionMedica(informacionMedica) {
        this.informacionMedica = informacionMedica;
        return this;
    }

    // Método para validar los datos obligatorios
    validate() {
        if (!this.nombre || !this.apellidos || !this.nif || !this.lenguaMaterna) {
            throw new Error('Faltan datos personales obligatorios');
        }
        if (this.familiares.length === 0) {
            throw new Error('Debe haber al menos un familiar');
        }
        if (!this.direccion) {
            throw new Error('La dirección es obligatoria');
        }
        if (!this.datosAcademicos) {
            throw new Error('Los datos académicos son obligatorios');
        }
        // La información médica es opcional
    }

    // Método para construir el objeto Alumno
    build() {
        this.validate();
        const alumno = new Alumno(this);
        this.reset();
        return alumno;
    }
}

// Creación del Alumno utilizando el AlumnoBuilder

const builder = new AlumnoBuilder();

// Establecer los datos personales
builder.setDatosPersonales(
    formData.nombre,
    formData.apellidos,
    formData.nif,
    formData.lenguaMaterna,
    formData.idiomasConocidos
);

// Añadir los familiares
formData.familiares.forEach(familiar => {
    builder.addFamiliar(new Familiar(
        familiar.nombre,
        familiar.apellidos,
        familiar.nif,
        familiar.profesion,
        familiar.ciudadNacimiento,
        familiar.lenguaMaterna,
        familiar.idiomasConocidos
    ));
});

// Establecer la dirección
builder.setDireccion(new Direccion(
    formData.direccion.pais,
    formData.direccion.ciudad,
    formData.direccion.poblacion,
    formData.direccion.direccionCompleta,
    formData.direccion.codigoPostal
));

// Establecer los datos académicos
builder.setDatosAcademicos(new DatosAcademicos(
    formData.datosAcademicos.colegioProcedencia,
    formData.datosAcademicos.nivelEstudios,
    formData.datosAcademicos.idiomasEstudiados,
    formData.datosAcademicos.nivelSolicitado
));

// Establecer la información médica (si existe)
if (formData.informacionMedica) {
    builder.setInformacionMedica(new InformacionMedica(
        formData.informacionMedica.alergias,
        formData.informacionMedica.medicacion
    ));
}

// Validar y construir el alumno
try {
    const alumno = builder.build();
    console.log(alumno);
} catch (error) {
    console.error("Error al construir el alumno:", error.message);
}
