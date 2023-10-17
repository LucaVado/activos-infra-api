const Proyecto = require('../models/proyecto');

exports.getProyectos = (req,res,next) => {
    Proyecto.findAll()
        .then(proyecto => {
            res.status(200).json({ 
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

exports.getProyecto = (req,res,next) => {
    const id = req.query.id;
    console.log(id);
    Proyecto.findOne({ where: {id: id}})
    .then(proyecto => {
        if(!proyecto) proyecto = "proyecto no encontrado";
        res.json({
            proyecto:proyecto
        })
    })
}

exports.postEditProyecto = (req,res,next) => {
    const proyectoId = req.body.proyecto.id;
    const updatedNombre = req.body.proyecto.nombre;    
    const updatedFechaEntrada = req.body.proyecto.fechaEntrada;
    const updatedFechaSalida = req.body.proyecto.fechasalida;
    
    console.log(activoId);
    Proyecto.findByPk(activoId)
        .then(proyecto => {
            console.log(proyecto)
            proyecto.nombre = updatedNombre;
            proyecto.fechaEntrada = updatedFechaEntrada;
            proyecto.fechasalida = updatedFechaSalida;
            return proyecto.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'proyecto editado',
                proyecto: result
            });
        })
        .catch( err => {
            console.log(err);
        });
}

exports.postDeleteProyecto = (req,res,next) => {
    const proyectoId = req.query.id;
    Proyecto.findByPk(proyectoId)
        .then(proyecto => {
            return proyecto.destroy();
        })
        .then(result => {
            res.status(201).json({
                message: 'proyecto eliminado',
                proyecto: result
            });
        })
        .catch( err => {
            console.log(err);
        });
}