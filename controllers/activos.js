const ExcelJS = require('exceljs');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
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

exports.buscarActivos = (req, res) => {
    // Sacar el string de búsqueda
    let busqueda = req.params.busqueda;

    // Convertir la búsqueda a minúsculas
    busqueda = busqueda.toLowerCase();

    // Realizar la búsqueda insensible a mayúsculas y minúsculas
    Activo.findAll({
        where: {
            [Op.or]: [
                { nombre: { [Op.like]: `%${busqueda}%` }},
                { numeroSerie: { [Op.like]: `%${busqueda}%` }}
            ]
        },
        order: [['fechaEntrada', 'DESC']]
    })
        .then(activosEncontrados => {
            if (!activosEncontrados || activosEncontrados.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado activos"
                });
            }

            return res.status(200).json({
                status: "success",
                activos: activosEncontrados
            });
        })
        .catch(error => {
            console.error("Error al buscar activos:", error);
            return res.status(500).json({
                status: "error",
                mensaje: "Error interno del servidor"
            });
        });
}

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
                        guia: activo.guia,
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
    const proyectoId = req.query.id;

    Activo.findAll({
        where: { proyectoId: proyectoId },
        include: [{
            model: TipoActivo
        }]
    })
        .then(activos => {
            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises).then(tiposActivos => {
                const proyectoPromise = Proyecto.findOne({ where: { id: proyectoId } });

                return Promise.all([proyectoPromise, tiposActivos]).then(result => {
                    const proyecto = result[0];
                    const tiposActivos = result[1];

                    activos.forEach((activo, index) => {
                        const formattedActivo = {
                            id: activo.id,
                            nombre: activo.nombre,
                            fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
                            fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
                            estatus: activo.estatus,
                            razon: activo.razon,
                            numeroSerie: activo.numeroSerie,
                            tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
                            codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
                            modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
                            proyecto: proyecto.nombre,
                            proyectoId: proyecto.id,
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
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Error interno del servidor.'
            });
        });
};
// exports.getActivosByProyecto = (req, res, next) => {
//     var activosArray = [];
//     const proyecto = req.query.id;

//     Activo.findAll({
//         where: { proyectoId: proyecto },
//         include: [{
//             model: TipoActivo
//         }]
//     })
//         .then(activos => {
//             const promises = activos.map(activo => {
//                 return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
//             });
//             return Promise.all(promises).then(tiposActivos => {
//                 activos.forEach((activo, index) => {
//                     const formattedActivo = {
//                         id: activo.id,
//                         nombre: activo.nombre,
//                         fechaEntrada: new Date(activo.fechaEntrada).toISOString().split('T')[0],
//                         fechaSalida: new Date(activo.fechaSalida).toISOString().split('T')[0],
//                         estatus: activo.estatus,
//                         razon: activo.razon,
//                         numeroSerie: activo.numeroSerie,
//                         tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
//                         codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
//                         modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
//                         proyecto: activo.proyectoId,
//                         user: activo.userId
//                     };
//                     activosArray.push(formattedActivo);
//                 });
//                 console.log('activosArray: ', activosArray);
//                 res.status(200).json({
//                     message: "activos obtenidos",
//                     activos: activosArray
//                 });
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: 'Error interno del servidor.'
//             });
//         });
// };


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
                        guia: activo.guia,
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

const setTableBorders = (worksheet, headers, lastRowNumber) => {
    const lastColumnIndex = headers.length;

    // Verificar que el índice de la última columna esté en el rango válido
    if (lastColumnIndex >= 1 && lastColumnIndex <= 16384) {
        // Obtener la letra de la última columna
        const lastColumnLetter = worksheet.getColumn(lastColumnIndex).letter;

        // Establecer bordes alrededor de toda la tabla
        const borderStyle = { style: 'thin', color: { argb: '000000' } }; // Puedes ajustar el color y estilo según tus preferencias

        worksheet.getCell(`A1:${lastColumnLetter}${lastRowNumber}`).border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle
        };
    } else {
        console.error('Índice de columna fuera de rango válido.');
    }
};

exports.generarReporteActivosProyectoExcel = (req, res, next) => {
    const proyectoId = req.query.id;

    Activo.findAll({
        where: { proyectoId: proyectoId },
        include: [{
            model: TipoActivo
        }]
    })
        .then(activos => {
            const promises = activos.map(activo => {
                return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
            });
            return Promise.all(promises).then(tiposActivos => {
                const proyectoPromise = Proyecto.findOne({ where: { id: proyectoId } });

                return Promise.all([proyectoPromise, tiposActivos]).then(result => {
                    const proyecto = result[0];
                    const tiposActivos = result[1];

                    const activosArray = activos.map((activo, index) => {
                        return {
                            ID: activo.id,
                            Nombre: activo.nombre,
                            'Fecha de Entrada': new Date(activo.fechaEntrada).toISOString().split('T')[0],
                            'Fecha de Salida': new Date(activo.fechaSalida).toISOString().split('T')[0],
                            Estatus: activo.estatus,
                            Razon: activo.razon,
                            Serie: activo.numeroSerie,
                            Tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
                            Codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
                            Modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
                            Proyecto: proyecto.nombre,
                        };
                    });

                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet('Activos');

                    // Estilo para encabezados del título de la tabla
                    const titleHeaderStyle = {
                        font: { color: { argb: 'FFFFFF' }, bold: true, size: 16 },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '002A52' } },
                        alignment: { vertical: 'middle', horizontal: 'center' }
                    };

                    // Combinar celdas para el título de la tabla
                    const headers = Object.keys(activosArray[0]);
                    worksheet.mergeCells(`A1:${String.fromCharCode(65 + headers.length - 1)}1`);
                    worksheet.getCell('A1').value = `Activos de proyecto ${proyecto.nombre}`;
                    worksheet.getCell('A1').style = titleHeaderStyle;

                    // Encabezados
                    const columnHeaderStyle = {
                        font: { color: { argb: 'FFFFFF' }, bold: true },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '3D9CFF' } },
                        alignment: { vertical: 'middle', horizontal: 'center' }
                    };

                    const headerRow = worksheet.addRow(headers);
                    headerRow.eachCell(cell => {
                        cell.style = columnHeaderStyle;
                    });

                    // Datos
                    activosArray.forEach(activo => {
                        const row = worksheet.addRow(Object.values(activo));
                        row.eachCell(cell => {
                            // Centrar el contenido de la celda
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };

                            // Ajustar el ancho de la celda al contenido
                            const columnWidth = Math.max(10, cell.value ? cell.value.toString().length + 2 : 10);
                            worksheet.getColumn(cell.col).width = columnWidth;
                        });
                    });

                    // // Añadir bordes alrededor de toda la tabla
                    // setTableBorders(worksheet, headers, worksheet.lastRow.number);

                    // Enviar el archivo Excel como respuesta
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', `attachment; filename=reporte_activos_proyecto_${proyecto.nombre}.xlsx`);

                    return workbook.xlsx.write(res)
                        .then(() => {
                            res.status(200).end();
                        });
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

// exports.generarReporteActivosProyectoExcel = (req, res, next) => {
//     const proyectoId = req.query.id;

//     Activo.findAll({
//         where: { proyectoId: proyectoId },
//         include: [{
//             model: TipoActivo
//         }]
//     })
//         .then(activos => {
//             const promises = activos.map(activo => {
//                 return TipoActivo.findOne({ where: { id: activo.tipoActivoId } });
//             });
//             return Promise.all(promises).then(tiposActivos => {
//                 const proyectoPromise = Proyecto.findOne({ where: { id: proyectoId } });

//                 return Promise.all([proyectoPromise, tiposActivos]).then(result => {
//                     const proyecto = result[0];
//                     const tiposActivos = result[1];

//                     const activosArray = activos.map((activo, index) => {
//                         return {
//                             ID: activo.id,
//                             Nombre: activo.nombre,
//                             'Fecha de Entrada': new Date(activo.fechaEntrada).toISOString().split('T')[0],
//                             'Fecha de Salida': new Date(activo.fechaSalida).toISOString().split('T')[0],
//                             Estatus: activo.estatus,
//                             Razon: activo.razon,
//                             Serie: activo.numeroSerie,
//                             Tipo: tiposActivos[index] ? tiposActivos[index].tipo : "activo no encontrado",
//                             Codigo: tiposActivos[index] ? tiposActivos[index].codigo : "codigo no encontrado",
//                             Modelo: tiposActivos[index] ? tiposActivos[index].modelo : "modelo no encontrado",
//                             Proyecto: proyecto.nombre,
//                             ProyectoId: proyecto.id,
//                             User: activo.userId
//                         };
//                     });

//                     const workbook = new ExcelJS.Workbook();
//                     const worksheet = workbook.addWorksheet('Activos');

//                     // Encabezados
//                     const headers = Object.keys(activosArray[0]);
//                     worksheet.addRow(headers);

//                     // Datos
//                     activosArray.forEach(activo => {
//                         worksheet.addRow(Object.values(activo));
//                     });

//                     // Enviar el archivo Excel como respuesta
//                     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//                     res.setHeader('Content-Disposition', `attachment; filename=reporte_activos_proyecto_${proyecto.nombre}.xlsx`);

//                     return workbook.xlsx.write(res)
//                         .then(() => {
//                             res.status(200).end();
//                         });
//                 });
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: 'Error interno del servidor.'
//             });
//         });
// };