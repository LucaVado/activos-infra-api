const Sucursal = require('../models/sucursal');

exports.createSucursal = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    Sucursal.create(content)
    .then(sucursal =>{
        console.log(sucursal);
        res.status(201).json({
            message: 'post sucursal creado',
            sucursal: sucursal
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}