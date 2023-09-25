const User = require('../models/user');

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