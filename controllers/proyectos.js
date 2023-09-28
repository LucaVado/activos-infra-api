const Proyecto = require('../models/proyecto');

exports.getProyectos = (req,res,next) => {
    Proyecto.findAll()
        .then(proyecto => {
            res.json({ 
                message: "proyectos obtenidos",
                proyecto: proyecto
            });
        })
        .catch(err => {
            console.log(err);
        });
}

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