const { validationResult } = require('express-validator');

const User = require('../models/user');
const TipoActivo= require('../models/tipo-activo');

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

const tipoActivos = [
    {
        nombre: 'Camara hikvision domo 4 MP',
        tipo: 'Domo IP 4 Megapixel',
        codigo: 'chd4MP',
        modelo: 'DS-2CD2143G2-I'
    },
    {
        nombre: 'Camara hikvision bala 4 MP',
        tipo: 'Bala IP 4 Megapíxel / ACUSENSE',
        codigo: 'chb4MP',
        modelo: 'DS-2CD1T43G2-I'
    },
    {
        nombre: 'Camara hikvision bala 4 MP',
        tipo: 'Bala IP 4 Megapixel / Lente 2.8 mm',
        codigo: 'chb4MP2.8',
        modelo: 'DS-2CD2043G2-I(U)'
    },
    {
        nombre: 'NVR hikvision 16IP',
        tipo: 'NVR Hikvision DS-7700',
        codigo: 'nvrh16IP',
        modelo: 'DS-7732NI-K4'
    },
]

exports.saveAllTipoActivos = (req, res, next) => {
    console.log('entro al route');
    saveTipoActivos(tipoActivos)
    .then(result => {
        console.log('añadidos');
        res.json({message:'creado!'});
    })
    .catch(err => console.log(err));
}

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

function saveTipoActivos(tipoActivos){
    for(i = 0; i < tipoActivos.length; i++){
        User.createTipoActivo({
            nombre: tipoActivos[i].nombre,
            tipo: tipoActivos[i].tipo,
            codigo: tipoActivos[i].codigo,
            modelo: tipoActivos[i].modelo
        })
        .then(result => {
            console.log('tipos añadidos!');
        })
        .catch(err =>{
            console.log(err);
        });
    }    
}