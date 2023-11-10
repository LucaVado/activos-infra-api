const Activo = require('../models/activo');
const TipoActivo = require('../models/tipo-activo');
const Proyecto = require('../models/proyecto');

// const activos = [ 
//     {
//         id: 1,
//         tipo: 'NVR',
//         Sucursal: 'MTRIZ',
//     },
//     {
//         id: 2,
//         tipo: 'Camara Hikvision',
//         Sucursal: 'MTRIZ',
//     }
// ]

exports.getActivos = (req, res, next) => {
    Activo.findAll()
        .then(activos => {
            res.json({
                message: "activos obtenidos",
                activos: activos
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getActivosPrueba = (req, res, next) => {
    var resActivo = {};
    Activo.findAll()
        .then(activos => {
            resActivo = activos.map(activo => {
                return {
                    ...activo.dataValues,
                    fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                    fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                };
            });

            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises);
        })
        .then(tiposActivos => {
            tiposActivos.forEach((tipoActivo, index) => {
                resActivo[index].tipoActivoId = tipoActivo ? tipoActivo.tipo : "activo no encontrado";
            });
            console.log(resActivo);
            res.json({
                message: "activos obtenidos",
                activos: resActivo
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// exports.getActivosCctv = (req, res, next) => {
//     var activo = {
//         id: null,
//         nombre: '',
//         fechaEntrada: '',
//         fechaSalida: '',
//         estatus: '',
//         razon: '',
//         tipo: '',
//         user: ''
//     };
//     var activosArray = [];
//     var resActivo = {};
//     Activo.findAll()
//         .then(activos => {
//             resActivo = activos.map(activo => {
//                 return {
//                     ...activo.dataValues,
//                     fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
//                     fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
//                 };
//             });

//             const promises = activos.map(activo => {
//                 return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
//             });
//             return Promise.all(promises);
//         })
//         .then(tiposActivos => {
//             tiposActivos.forEach((tipoActivo, index) => {
//                 resActivo[index].tipoActivoId = tipoActivo ? tipoActivo.tipo : "activo no encontrado";
//             });
//             console.log('resActivo: ',resActivo);
//             for (item in resActivo) {
//                 console.log('item: ',resActivo[item]);
//                 activo.id = resActivo[item].id;
//                 activo.nombre = resActivo[item].nombre;
//                 activo.fechaEntrada = resActivo[item].fechaEntrada;
//                 activo.fechaSalida = resActivo[item].fechaSalida;
//                 activo.estatus = resActivo[item].estatus;
//                 activo.razon = resActivo[item].razon;
//                 activo.tipo = resActivo[item].tipoActivoId;
//                 activo.user = resActivo[item].userId;
//                 activosArray.push(activo);
//                 console.log('array: ',activosArray)
//             }
//             res.json({
//                 message: "activos obtenidos",
//                 activos: activosArray
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }
exports.getActivosByTipo = (req, res, next) => {
    var activosArray = [];
    const tipo = req.query.tipo;
    console.log(tipo);
    Activo.findAll({
        include: [{
            model: TipoActivo,
            where: { tipo: tipo }
        }]
    })
        .then(activos => {
            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises).then(tiposActivos => {
                activos.forEach((activo, index) => {
                    const formattedActivo = {
                        id: activo.id,
                        nombre: activo.nombre,
                        fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                        fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                        estatus: activo.estatus,
                        razon: activo.razon,
                        tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
                        codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
                        modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
                        user: activo.userId
                    };
                    activosArray.push(formattedActivo);
                });
                console.log('activosArray: ', activosArray);
                res.json({
                    message: "activos obtenidos",
                    activos: activosArray
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.getActivosByEstatus = (req, res, next) => {
    var activosArray = [];
    const estatus = req.query.estatus;
    console.log(estatus);
    Activo.findAll({
        where: { estatus: estatus }, // Agrega la cláusula where aquí
        include: [{
            model: TipoActivo
        }]
    })
        .then(activos => {
            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises).then(tiposActivos => {
                activos.forEach((activo, index) => {
                    const formattedActivo = {
                        id: activo.id,
                        nombre: activo.nombre,
                        fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                        fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                        estatus: activo.estatus,
                        razon: activo.razon,
                        tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
                        codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
                        modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
                        user: activo.userId
                    };
                    activosArray.push(formattedActivo);
                });
                console.log('activosArray: ', activosArray);
                res.json({
                    message: "activos obtenidos",
                    activos: activosArray
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getActivosByProyecto = (req, res, next) => {
    var activosArray = [];
    const proyecto = req.query.id;

    Activo.findAll({
        where: { proyectoId: proyecto },
        include: [{
            model: TipoActivo
        }]
    })
        .then(activos => {
            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises).then(tiposActivos => {
                activos.forEach((activo, index) => {
                    const formattedActivo = {
                        id: activo.id,
                        nombre: activo.nombre,
                        fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                        fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                        estatus: activo.estatus,
                        razon: activo.razon,
                        tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
                        codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
                        modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
                        proyecto: activo.proyectoId,
                        user: activo.userId
                    };
                    activosArray.push(formattedActivo);
                });
                console.log('activosArray: ', activosArray);
                res.status(200).json({
                    message: "activos obtenidos",
                    activos: activosArray
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Error interno del servidor.'
            });
        });
};


exports.getActivo = (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    Activo.findOne({ where: { id: id } })
        .then(activo => {
            if (!activo) activo = "activo no encontrado";
            return TipoActivo.findOne({ where: { id: activo.tipoActivoId } }).then(tipoActivo => {
                return Proyecto.findOne({ where: { id: activo.proyectoId } }).then(proyecto => {
                    const formattedActivo = {
                        id: activo.id,
                        nombre: activo.nombre,
                        fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                        fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                        estatus: activo.estatus,
                        razon: activo.razon,
                        numeroSerie: activo.numeroSerie,
                        numeroActivo: activo.numeroActivo,
                        tipo: tipoActivo ? tipoActivo.tipo : "activo no encontrado",
                        codigo: tipoActivo ? tipoActivo.codigo : "codigo no encontrado",
                        modelo: tipoActivo ? tipoActivo.modelo : "modelo no encontrado",
                        user: activo.userId,
                        proyectoId: activo.proyectoId,
                        proyecto: proyecto ? proyecto.nombre : "proyecto no encontrado"
                    };
                    res.status(200).json({
                        activo: formattedActivo
                    });
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.changeEstatusByNumeroSerie = (req, res, next) => {
    const numeroSerie = req.body.content.numeroSerie;
    console.log(numeroSerie)
    const nuevoEstatus = 'Productivo'; 

    Activo.update({ estatus: nuevoEstatus }, { where: { numeroSerie: numeroSerie } })
        .then(result => {
            const rowsUpdated = result[0]; // Accede a las filas actualizadas desde el resultado
            if (rowsUpdated > 0) {
                res.status(200).json({
                    message: `Estatus del activo con número de serie ${numeroSerie} actualizado con éxito.`,
                });
            } else {
                res.status(404).json({
                    message: `No se encontró ningún activo con el número de serie ${numeroSerie}.`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Error interno del servidor.'
            });
        });
};




// exports.getActivo = (req, res, next) => {
//     const id = req.query.id;
//     console.log(id);
//     Activo.findOne({ where: { id: id } })
//         .then(activo => {
//             if (!activo) activo = "activo no encontrado";
//             res.status(200).json({
//                 activo: activo
//             })
//         })
// }

exports.createActivo = (req, res, next) => {
    const content = req.body.content;
    console.log('content:', content);
    
    // console.log(content.activo.numeroActivo)
    Activo.create(content)
        .then(activo => {
            console.log(activo);
            res.status(201).json({
                message: 'post Activo creado',
                activo: content
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postEditActivo = (req, res, next) => {
    const activoId = req.body.activo.id;
    const updatedNombre = req.body.activo.nombre;
    const updatedNumeroSerie = req.body.activo.numeroSerie;
    const updatedNumeroActivo = req.body.activo.numeroActivo;
    const updatedFechaEntrada = req.body.activo.fechaEntrada;
    const updatedFechaSalida = req.body.activo.fechasalida;
    const updatedEstatus = req.body.activo.estatus;
    const updatedfolio = req.body.activo.folio;
    const updatedGuia = req.body.activo.guia;
    const updatedRazon = req.body.activo.razon;

    console.log(updatedNombre);
    Activo.findByPk(activoId)
        .then(activo => {
            console.log(activo)
            activo.nombre = updatedNombre;
            activo.numeroSerie = updatedNumeroSerie;
            activo.numeroActivo = updatedNumeroActivo;
            activo.fechaEntrada = updatedFechaEntrada;
            activo.fechasalida = updatedFechaSalida;
            activo.estatus = updatedEstatus;
            activo.folio = updatedfolio;
            activo.guia = updatedGuia;
            activo.razon = updatedRazon;

            return activo.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'activo editado',
                activo: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteActivo = (req, res, next) => {
    const activoId = req.query.id;
    Activo.findByPk(activoId)
        .then(activo => {
            return activo.destroy();
        })
        .then(result => {
            res.status(201).json({
                message: 'activo eliminado',
                activo: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}