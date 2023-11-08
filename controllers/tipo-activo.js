const TipoActivo= require('../models/tipo-activo');

// const activos = [ 
//     {
//         id: 1,
//         tipo: 'NVR',
//         Sucursal: 'MTRIZ',
//     },
//     {
//         id: 2,
//         tipo: 'Camara Hikvision',
//         Sucursal: 'MTRIZ',
//     }
// ]

// const tipoActivos = [
//     {
//         nombre: 'Camara hikvision domo 4 MP',
//         tipo: 'Domo IP 4 Megapixel',
//         codigo: 'chd4MP',
//         modelo: 'DS-2CD2143G2-I'
//     },
//     {
//         nombre: 'Camara hikvision bala 4 MP',
//         tipo: 'Bala IP 4 Megapíxel / ACUSENSE',
//         codigo: 'chb4MP',
//         modelo: 'DS-2CD1T43G2-I'
//     },
//     {
//         nombre: 'Camara hikvision bala 4 MP',
//         tipo: 'Bala IP 4 Megapixel / Lente 2.8 mm',
//         codigo: 'chb4MP2.8',
//         modelo: 'DS-2CD2043G2-I(U)'
//     },
//     {
//         nombre: 'NVR hikvision 16IP',
//         tipo: 'NVR Hikvision DS-7700',
//         codigo: 'nvrh16IP',
//         modelo: 'DS-7732NI-K4'
//     },
// ]

exports.getTipos = (req,res,next) => {
    TipoActivo.findAll()
        .then(tipos => {
            res.json({ 
                message: "tipos obtenidos",
                tipos: tipos
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getTipoByCode = (req, res, next) => {
    const codigo = req.query.codigo;
    TipoActivo.findOne({ where: { codigo: codigo } })
        .then(tipo => {
            if (!tipo) {
                return res.status(404).json({ message: "Tipo de activo no encontrado" });
            }
            res.json({ 
                message: "Tipo de activo obtenido",
                tipo: tipo
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.createTipo = (req,res,next) =>{

    const content = req.body.content;
    console.log('content:',content);

    TipoActivo.create(content)
    .then(tipo =>{
        console.log(tipo);
        res.status(200).status(201).json({
            message: 'post tipo creado',
            tipo: tipo
        });
    })
    .catch(err => {
        console.log(err);
      });
    
}

exports.saveAllTipoActivos = (req, res, next) => {
    console.log('entro al route');
    const content = req.body.content;
    console.log(content);
    saveTipoActivos(content)
    res.json({
        message: 'post activos creado',
        activos: content
    });
}

exports.postDeleteTipo = (req,res,next) => {
    const userId = req.query.id;
    TipoActivo.findByPk(userId)
        .then(tipoActivo => {
            return tipoActivo.destroy();
        })
        .then(tipoActivo => {
            res.status(201).json({
                message: 'tipo eliminada',
                tipo: tipoActivo
            });
        })
        .catch( err => {
            console.log(err);
        });
}

function saveTipoActivos(tipoActivos){
    for(i = 0; i < tipoActivos.length; i++){
        TipoActivo.create({
            nombre: tipoActivos[i].nombre,
            tipo: tipoActivos[i].tipo,
            codigo: tipoActivos[i].codigo,
            modelo: tipoActivos[i].modelo,
            userId: tipoActivos[i].userId
        })
        .then(result => {
            console.log('tipos añadidos!');
        })
        .catch(err =>{
            console.log(err);
        });
    }    
}

// {
//     "content": [
//         {
//             "nombre": "Camara hikvision domo 4 MP",
//             "tipo": "CCTV",
//             "codigo": "chd4M",
//             "modelo": "DS-2CD2143G2-I",
//             "userId":1
//         },
//         {
//             "nombre": "Teclado DSC",
//             "tipo": "Alarma",
//             "codigo": "chb4MP",
//             "modelo": "DS-2CD1T43G2-I",
//             "userId":1
//         },
//         {
//             "nombre": "Camara hikvision bala 4 MP",
//             "tipo": "CCTV",
//             "codigo": "chb4MP2.8",
//             "modelo": "DS-2CD2043G2-I(U)",
//             "userId":1
//         },
//         {
//             "nombre": "Panel de alarma",
//             "tipo": "Alarma",
//             "codigo": "nvrh16IP",
//             "modelo": "DS-7732NI-K4",
//             "userId":1
//         }
//     ]
// }