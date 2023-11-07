const Proyecto = require('../models/proyecto');
const Sucursal = require('../models/sucursal');

exports.getProyectos = (req, res, next) => {
    Proyecto.findAll({
        include: {
            model: Sucursal,
            attributes: ['nombre']
        }
    })
        .then(proyectos => {
            const formattedProyectos = proyectos.map(proyecto => {
                return {
                    id: proyecto.id,
                    nombre: proyecto.nombre,
                    fechaEntrada: proyecto.fechaEntrada.toISOString().slice(0, 10),
                    fechaSalida: proyecto.fechaSalida.toISOString().slice(0, 10),
                    estatus: proyecto.estatus,
                    guia: proyecto.guia,
                    razon: proyecto.razon,
                    createdAt: proyecto.createdAt,
                    updatedAt: proyecto.updatedAt,
                    userId: proyecto.userId,
                    destino: proyecto.sucursal.nombre
                };
            });

            console.log(formattedProyectos);
            res.status(200).json({
                message: "proyectos obtenidos",
                proyecto: formattedProyectos
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// exports.getProyectos = (req,res,next) => {
//     Proyecto.findAll()
//         .then(proyecto => {
//             console.log(proyecto)
//             res.status(200).json({ 
//                 message: "proyectos obtenidos",
//                 proyecto: proyecto
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

exports.createProyecto = (req, res, next) => {
    const content = req.body.content;
    const { sucursal, fechaEntrada, fechaSalida, ...proyectoData } = content;
    console.log('content: ', content)

    // Validar la lógica de las fechas
    const fechaEntradaDate = new Date(fechaEntrada);
    const fechaSalidaDate = new Date(fechaSalida);
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;
    const maxYear = currentYear + 100;

    if (fechaEntradaDate > fechaSalidaDate) {
        return res.status(400).json({ message: "La fecha de entrada no puede ser posterior a la fecha de salida" });
    }
    if (fechaEntradaDate.getFullYear() < minYear || fechaEntradaDate.getFullYear() > maxYear) {
        return res.status(400).json({ message: "Ingrese un año valido" });
    }
    if (fechaSalidaDate.getFullYear() < minYear || fechaSalidaDate.getFullYear() > maxYear) {
        return res.status(400).json({ message: "Ingrese un año valido" });
    }

    Sucursal.findOne({ where: { iata: sucursal } })
        .then((sucursalData) => {
            if (!sucursalData) {
                return res.status(404).json({ message: "No se encontró la sucursal" });
            }

            const updatedContent = { ...proyectoData, sucursalId: sucursalData.id, fechaEntrada, fechaSalida };
            console.log(updatedContent)
            Proyecto.create(updatedContent)
                .then((proyecto) => {
                    console.log(proyecto);
                    res.status(201).json({
                        message: 'post proyecto creado',
                        proyecto: proyecto
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// exports.createProyecto = (req, res, next) => {
//     const content = req.body.content;
//     const { sucursal, ...proyectoData } = content;

//     Sucursal.findOne({ where: { iata: sucursal } })
//         .then((sucursalData) => {
//             if (!sucursalData) {
//                 return res.status(404).json({ message: "No se encontró la sucursal" });
//             }

//             const updatedContent = { ...proyectoData, sucursalId: sucursalData.id };

//             Proyecto.create(updatedContent)
//                 .then((proyecto) => {
//                     console.log(proyecto);
//                     res.status(201).json({
//                         message: 'post proyecto creado',
//                         proyecto: proyecto
//                     });
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// exports.createProyecto = (req,res,next) =>{

//     const content = req.body.content;
//     console.log('content:',content);

//     Proyecto.create(content)
//     .then(proyecto =>{
//         console.log(proyecto);
//         res.status(201).json({
//             message: 'post proyecto creado',
//             proyecto: proyecto
//         });
//     })
//     .catch(err => {
//         console.log(err);
//       });

// }

exports.getProyecto = (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    Proyecto.findOne({
        where: { id: id },
        include: Sucursal
    })
        .then(proyecto => {
            if (!proyecto) proyecto = "proyecto no encontrado";
            console.log('proyecto: ', proyecto)
            const formattedProyecto = {
                id: proyecto.id,
                nombre: proyecto.nombre,
                fechaEntrada: proyecto.fechaEntrada.toISOString().slice(0, 10),
                fechaSalida: proyecto.fechaSalida.toISOString().slice(0, 10),
                estatus: proyecto.estatus,
                guia: proyecto.guia,
                razon: proyecto.razon,
                createdAt: proyecto.createdAt,
                updatedAt: proyecto.updatedAt,
                userId: proyecto.userId,
                sucursal: proyecto.sucursal.iata
            };
            res.status(200).json({
                proyecto: formattedProyecto
            });
            console.log(formattedProyecto)
        })
        .catch(err => {
            console.log(err);
        });
};

// exports.getProyecto = (req,res,next) => {
//     const id = req.query.id;
//     console.log(id);
//     Proyecto.findOne({ where: {id: id}})
//     .then(proyecto => {
//         if(!proyecto) proyecto = "proyecto no encontrado";
//         res.status(200).json({
//             proyecto:proyecto
//         })
//     })
// }

exports.getProyectoByName = (req, res, next) => {
    const nombre = req.query.proyecto;
    console.log(nombre);

    Proyecto.findOne({ where: { nombre: nombre } })
        .then(proyecto => {
            if (!proyecto) {
                return res.status(404).json({ message: "Proyecto no encontrado" });
            }
            proyecto.fechaEntrada = proyecto.fechaEntrada.toISOString().slice(0,10);
            res.json({ 
                message: "Proyecto obtenido",
                proyecto: proyecto
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postEditProyecto = (req, res, next) => {
    const proyectoId = req.body.proyecto.id;
    const updatedNombre = req.body.proyecto.nombre;
    const updatedFechaEntrada = req.body.proyecto.fechaEntrada;
    const updatedFechaSalida = req.body.proyecto.fechaSalida;
    const updatedSucursal = req.body.proyecto.sucursal;
    const updatedGuia = req.body.proyecto.guia;
    const updatedEstatus = req.body.proyecto.estatus;
    const updatedRazon = req.body.proyecto.razon;

    // Validar la lógica de las fechas
    const fechaEntradaDate = new Date(updatedFechaEntrada);
    const fechaSalidaDate = new Date(updatedFechaSalida);
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;
    const maxYear = currentYear + 100;

    if (!updatedFechaEntrada || !updatedFechaSalida) {
        return res.status(400).json({ message: "Las fechas no pueden ser nulas" });
    }

    if (fechaEntradaDate > fechaSalidaDate) {
        return res.status(400).json({ message: "La fecha de entrada no puede ser posterior a la fecha de salida" });
    }
    if (fechaEntradaDate.getFullYear() < minYear || fechaEntradaDate.getFullYear() > maxYear) {
        return res.status(400).json({ message: "Ingrese un año válido para la fecha de entrada" });
    }
    if (fechaSalidaDate.getFullYear() < minYear || fechaSalidaDate.getFullYear() > maxYear) {
        return res.status(400).json({ message: "Ingrese un año válido para la fecha de salida" });
    }


    console.log(proyectoId);
    Proyecto.findByPk(proyectoId)
        .then(proyecto => {
            console.log(proyecto);
            proyecto.nombre = updatedNombre;
            proyecto.fechaEntrada = updatedFechaEntrada;
            proyecto.fechaSalida = updatedFechaSalida;
            proyecto.guia = updatedGuia;
            proyecto.estatus = updatedEstatus;
            proyecto.razon = updatedRazon;

            Sucursal.findOne({ where: { nombre: updatedSucursal } })
                .then(sucursalData => {
                    if (sucursalData) {
                        proyecto.sucursalId = sucursalData.id;
                    }

                    return proyecto.save();
                })
                .then(result => {
                    res.status(201).json({
                        message: 'Proyecto editado',
                        proyecto: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ message: "Hubo un problema al encontrar la sucursal" });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Hubo un problema al encontrar el proyecto" });
        });
};

// exports.postEditProyecto = (req,res,next) => {
//     const proyectoId = req.body.proyecto.id;
//     const updatedNombre = req.body.proyecto.nombre;    
//     const updatedFechaEntrada = req.body.proyecto.fechaEntrada;
//     const updatedFechaSalida = req.body.proyecto.fechasalida;

//     console.log(proyectoId);
//     Proyecto.findByPk(proyectoId)
//         .then(proyecto => {
//             console.log(proyecto)
//             proyecto.nombre = updatedNombre;
//             proyecto.fechaEntrada = updatedFechaEntrada;
//             proyecto.fechasalida = updatedFechaSalida;
//             return proyecto.save();
//         })
//         .then(result => {
//             res.status(201).json({
//                 message: 'proyecto editado',
//                 proyecto: result
//             });
//         })
//         .catch( err => {
//             console.log(err);
//         });
// }

exports.postDeleteProyecto = (req, res, next) => {
    const proyectoId = req.query.id;
    Proyecto.findByPk(proyectoId)
        .then(proyecto => {
            return proyecto.destroy();
        })
        .then(result => {
            res.status(201).json({
                message: 'proyecto eliminado',
                proyecto: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}