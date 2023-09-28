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