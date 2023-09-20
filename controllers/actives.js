const { validationResult } = require('express-validator');
const activos = [ 
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

exports.getActives = (req,res,next) => {
    res.status(200).json({
        actives: [
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

exports.createActives = (req,res,next) =>{
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(422).json({message: 'validation failed', errors: errors.array()});
    // }
    const content = req.body.content;
    console.log('content:',content);
    res.status(201).json({
        message: 'post activos creado',
        active: content
    });
}