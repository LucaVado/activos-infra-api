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
    const id = req.query.id;
    console.log(id);
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

exports.postEditUser = (req,res,next) => {
    const userId = req.body.user.id;
    const updatedNombre = req.body.user.nombre;    
    const updatedApellidoPaterno = req.body.user.apellidoPaterno;
    const updatedapellidoMaterno = req.body.user.apellidoMaterno;
    const updatedNumeroEmpleado = req.body.user.numeroEmpleado;
    const updatedCorreo = req.body.user.correo;
    const updatedPassword = req.body.user.password;
    const updatedTipousuario = req.body.user.tipoUsuario;
    
    console.log(userId);
    User.findByPk(userId)
        .then(user => {
            console.log(user)
            user.nombre = updatedNombre;
            user.numeroSerie = updatedApellidoPaterno;
            user.numeroActivo = updatedapellidoMaterno;
            user.fechaEntrada = updatedNumeroEmpleado;
            user.fechasalida = updatedCorreo;
            user.estatus = updatedPassword;
            user.folio = updatedTipousuario;

            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'user editado',
                user: result
            });
        })
        .catch( err => {
            console.log(err);
        });
}

exports.postDeleteUser = (req,res,next) => {
    const userId = req.query.id;
    User.findByPk(userId)
        .then(user => {
            return user.destroy();
        })
        .then(result => {
            res.status(201).json({
                message: 'user eliminado',
                user: result
            });
        })
        .catch( err => {
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