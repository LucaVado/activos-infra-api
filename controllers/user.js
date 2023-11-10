const User = require('../models/user');
const Sucursal = require('../models/sucursal'); 
const Departamento = require('../models/departamento'); 
const { use } = require('../routes/activos');


exports.getUsers = (req, res, next) => {
    User.findAll({
        include: [
            {
                model: Sucursal,
                as: 'sucursal'
            },
            {
                model: Departamento,
                as: 'departamento'
            }
        ]
    })
        .then(users => {
            const modifiedUsers = users.map(user => {
                const { nombre, apellidoPaterno, apellidoMaterno } = user;
                const fullName = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
                const sucursalNombre = user.sucursal ? user.sucursal.nombre : null;
                const departamentoNombre = user.departamento ? user.departamento.nombre : null;

                return {
                    id: user.id,
                    nombreCompleto: fullName,
                    numeroEmpleado: user.numeroEmpleado,
                    correo: user.correo,
                    password: user.password,
                    tipoUsuario: user.tipoUsuario,
                    sucursal: sucursalNombre,
                    departamento: departamentoNombre,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
            });

            res.json({
                message: "usuarios obtenidos",
                users: modifiedUsers
            });
        })
        .catch(err => {
            console.log(err);
        });
}

// exports.getUsers = (req,res,next) => {
//     User.findAll()
//         .then(users => {
//             res.json({ 
//                 message: "usuarios obtenidos",
//                 users: users
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

exports.getUser = (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    User.findOne({ 
        where: { id: id },
        include: [Sucursal, Departamento] // Incluye los modelos de Sucursal y Departamento
    })
    .then(user => {
        if(!user) user = "usuario no encontrado";
        res.json({
            user: user
        })
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Hubo un problema al obtener el usuario" });
    });
}

// exports.getUser = (req,res,next) => {
//     const id = req.query.id;
//     console.log(id);
//     User.findOne({ where: {id: id}})
//     .then(user => {
//         if(!user) user = "usuario no encontrado";
//         res.json({
//             user:user
//         })
//     })
// }

exports.createUser = (req, res, next) => {
    const content = req.body.content;
    const { sucursal, departamento, ...userData } = content;

    Sucursal.findOne({ where: { iata: sucursal } })
        .then((sucursalData) => {
            if (!sucursalData) {
                return res.status(404).json({ message: "No se encontró la sucursal" });
            }

            Departamento.findOne({ where: { nombre: departamento } })
                .then((departamentoData) => {
                    if (!departamentoData) {
                        return res.status(404).json({ message: "No se encontró el departamento" });
                    }

                    User.create({ ...userData, sucursalId: sucursalData.id, departamentoId: departamentoData.id })
                        .then((user) => {
                            console.log(user);
                            res.status(201).json({
                                message: 'Usuario creado exitosamente',
                                user: user
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({ message: "Hubo un problema al crear el usuario" });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({ message: "Hubo un problema al encontrar el departamento" });
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Hubo un problema al encontrar la sucursal" });
        });
};


// exports.createUser = async (req, res, next) => {
//     const content = req.body.content;
//     const { sucursal, departamento, ...userData } = content;

//     try {
//         const sucursalData = await Sucursal.findOne({ where: { iata: sucursal } });
//         const departamentoData = await Departamento.findOne({ where: { nombre: departamento } });

//         if (!sucursalData || !departamentoData) {
//             return res.status(404).json({ message: "No se encontró la sucursal o el departamento" });
//         }

//         const user = await User.create({ ...userData, sucursalId: sucursalData.id, departamentoId: departamentoData.id });

//         console.log(user);
//         res.status(201).json({
//             message: 'Usuario creado exitosamente',
//             user: user
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Hubo un problema al crear el usuario" });
//     }
// };
// exports.createUser = (req,res,next) =>{

//     const content = req.body.content;
//     console.log('content:',content);

//     User.create(content)
//     .then(user =>{
//         console.log(user);
//         res.status(201).json({
//             message: 'post usuario creado',
//             user: user
//         });
//     })
//     .catch(err => {
//         console.log(err);
//       });
    
// }

exports.postEditUser = (req, res, next) => {
    const userId = req.body.user.id;
    const updatedNombre = req.body.user.nombre;
    const updatedApellidoPaterno = req.body.user.apellidoPaterno;
    const updatedapellidoMaterno = req.body.user.apellidoMaterno;
    const updatedNumeroEmpleado = req.body.user.numeroEmpleado;
    const updatedCorreo = req.body.user.correo;
    const updatedPassword = req.body.user.password;
    const updatedTipousuario = req.body.user.tipoUsuario;
    const updatedSucursal = req.body.user.sucursal;
    const updatedDepartamento = req.body.user.departamento;

    console.log(userId);
    User.findByPk(userId)
        .then(user => {
            console.log(user);
            user.nombre = updatedNombre;
            user.apellidoPaterno = updatedApellidoPaterno;
            user.apellidoMaterno = updatedapellidoMaterno;
            user.numeroEmpleado = updatedNumeroEmpleado;
            user.correo = updatedCorreo;
            user.password = updatedPassword;
            user.tipoUsuario = updatedTipousuario;

            Sucursal.findOne({ where: { nombre: updatedSucursal } })
                .then(sucursalData => {
                    if (sucursalData) {
                        user.sucursalId = sucursalData.id;
                    }

                    Departamento.findOne({ where: { nombre: updatedDepartamento } })
                        .then(departamentoData => {
                            if (departamentoData) {
                                user.departamentoId = departamentoData.id;
                            }

                            return user.save();
                        })
                        .then(result => {
                            res.status(201).json({
                                message: 'user editado',
                                user: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ message: "Hubo un problema al encontrar el departamento" });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ message: "Hubo un problema al encontrar la sucursal" });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Hubo un problema al encontrar el usuario" });
        });
}


// exports.postEditUser = (req,res,next) => {
//     const userId = req.body.user.id;
//     const updatedNombre = req.body.user.nombre;    
//     const updatedApellidoPaterno = req.body.user.apellidoPaterno;
//     const updatedapellidoMaterno = req.body.user.apellidoMaterno;
//     const updatedNumeroEmpleado = req.body.user.numeroEmpleado;
//     const updatedCorreo = req.body.user.correo;
//     const updatedPassword = req.body.user.password;
//     const updatedTipousuario = req.body.user.tipoUsuario;
    
//     console.log(userId);
//     User.findByPk(userId)
//         .then(user => {
//             console.log(user)
//             user.nombre = updatedNombre;
//             user.numeroSerie = updatedApellidoPaterno;
//             user.numeroActivo = updatedapellidoMaterno;
//             user.fechaEntrada = updatedNumeroEmpleado;
//             user.fechasalida = updatedCorreo;
//             user.estatus = updatedPassword;
//             user.folio = updatedTipousuario;

//             return user.save();
//         })
//         .then(result => {
//             res.status(201).json({
//                 message: 'user editado',
//                 user: result
//             });
//         })
//         .catch( err => {
//             console.log(err);
//         });
// }

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

exports.getUserLogin = async (req, res) => {
    const { correo, password } = req.body;
  
    try {
      // Buscar al usuario por correo
      const user = await User.findOne({ where: { correo: correo }, include: [Sucursal, Departamento] });
  
      // Verificar si el usuario existe
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Verificar la contraseña sin cifrar
      if (password !== user.password) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Las credenciales son válidas
      res.json({ user: user });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un problema al procesar la solicitud' });
    }
  };
  

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