const Activo = require('../models/activo');

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

exports.getActivos = (req,res,next) => {
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

exports.getActivo = (req,res,next) => {
    const id = req.query.id;
    console.log(id);
    Activo.findOne({ where: {id: id}})
    .then(activo => {
        if(!activo) activo = "activo no encontrado";
        res.json({
            activo:activo
        })
    })
}

exports.createActivo = (req,res,next) =>{
    const content = req.body.content;
    console.log('content:',content);

    Activo.create(content)
    .then(activo =>{
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

exports.postEditActivo = (req,res,next) => {
    const activoId = req.body.activo.id;
    const updatedNombre = req.body.activo.nombre;    
    const updatedNumeroSerie = req.body.activo.numeroSerie;
    const updatedNumeroActivo = req.body.activo.numeroActivo;
    const updatedFechaEntrada = req.body.activo.fechaEntrada;
    const updatedFechaSalida = req.body.activo.fechasalida;
    const updatedEstatus = req.body.activo.estatus;
    const updatedfolio = req.body.activo.folio;
    const updatedGuia = req.body.activo.guia;
    
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

            return activo.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'activo editado',
                activo: result
            });
        })
        .catch( err => {
            console.log(err);
        });
}

exports.postDeleteActivo = (req,res,next) => {
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
        .catch( err => {
            console.log(err);
        });
}