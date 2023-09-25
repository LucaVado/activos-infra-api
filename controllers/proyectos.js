const Proyecto = require('../models/proyecto');

exports.createProyecto = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    Proyecto.create(content)
    .then(proyecto =>{
        console.log(proyecto);
        res.status(201).json({
            message: 'post proyecto creado',
            proyecto: proyecto
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}