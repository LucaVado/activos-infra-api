const User = require('../models/user');
const { use } = require('../routes/activos');

exports.getUsers = (req,res,next) => {
    User.findAll()
        .then(users => {
            res.json({ 
                message: "usuarios obtenidos",
                users: users
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getUser = (req,res,next) => {
    const id = req.body.id;
    User.findOne({ where: {id: id}})
    .then(user => {
        if(!user) user = "usuario no encontrado";
        res.json({
            user:user
        })
    })
}

exports.createUser = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    User.create(content)
    .then(user =>{
        console.log(user);
        res.status(201).json({
            message: 'post usuario creado',
            user: user
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}

// {
//     "content": {
//         "nombre": "Jose Carlos", 
//         "apellidoPaterno":"Jimenez",
//         "apellidoMaterno": "Bacasegua",
//         "numeroEmpleado": 123,
//         "correo": "practicanteinfra2@paquetexpress.com.mx",
//         "contraseña":"1234",
//         "tipoUsuario": "Admin",
//         "sucursalId": 1,
//         "departamentoId": 1
//     }
// }