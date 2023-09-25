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
    res.status(200).json({
        activos: [
            {
                id: 1,
                tipo: 'NVR',
                Sucursal: 'MTRIZ',
            },
            {
                id: 2,
                tipo: 'Camara Hikvision',
                Sucursal: 'MTRIZ',
            }
        ]
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