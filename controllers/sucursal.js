const Sucursal = require('../models/sucursal');

exports.getSucursales = (req,res,next) => {
    Sucursal.findAll()
        .then(sucursal => {
            res.status(200).json({ 
                message: "sucursales obtenidos",
                sucursal: sucursal
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getSucursal = (req,res,next) => {
    const id = req.query.id;
    console.log(id);
    Sucursal.findOne({ where: {id: id}})
    .then(sucursal => {
        if(!sucursal) sucursal = "sucursal no encontrada";
        res.status(201).json({
            sucursal:sucursal
        })
    })
}

exports.createSucursal = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    Sucursal.create(content)
    .then(sucursal =>{
        console.log(sucursal);
        res.status(200).status(201).json({
            message: 'post sucursal creado',
            sucursal: sucursal
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}

exports.postEditSucursal = (req,res,next) => {
    const userId = req.body.sucursal.id;
    const updatedNombre = req.body.sucursal.nombre;    
    const updatedIata = req.body.sucursal.iata;
    const updatedLatitud = req.body.sucursal.latitud;
    const updatedlongitud = req.body.sucursal.longitud;
    const updatedestado = req.body.sucursal.estado;
    
    console.log(userId);
    Sucursal.findByPk(userId)
        .then(sucursal => {
            sucursal.nombre = updatedNombre;
            sucursal.iata = updatedIata;
            sucursal.latitud = updatedLatitud;
            sucursal.longitud = updatedlongitud;
            sucursal.estado = updatedestado;

            return sucursal.save();
        })
        .then(sucursal => {
            res.status(201).json({
                message: 'sucursal editada',
                sucursal: sucursal
            });
        })
        .catch( err => {
            console.log(err);
        });
}

exports.postDeleteSucursal = (req,res,next) => {
    const userId = req.query.id;
    Sucursal.findByPk(userId)
        .then(sucursal => {
            return sucursal.destroy();
        })
        .then(sucursal => {
            res.status(201).json({
                message: 'sucursal eliminada',
                sucursal: sucursal
            });
        })
        .catch( err => {
            console.log(err);
        });
}