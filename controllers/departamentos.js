const Departamento = require('../models/departamento');

exports.createDepartamento = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    Departamento.create(content)
    .then(departamento =>{
        console.log(departamento);
        res.status(201).json({
            message: 'post departamento creado',
            departamento: departamento
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}

exports.getDepartamento = (req,res,next) => {
    Departamento.findAll()
        .then(departamento => {
            res.json({ 
                message: "departamentos obtenidos",
                departamento: departamento
            });
        })
        .catch(err => {
            console.log(err);
        });
}