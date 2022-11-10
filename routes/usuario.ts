import {Router, Request, Response} from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

//login
userRoutes.post('/login',(req: Request, res: Response)=>{
    const body = req.body;

    Usuario.findOne({rut:body.rut},(err: any ,userBD: any)=>{
        
        if (err) throw err;

        if(!userBD){
            return res.json({
                ok:false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }

        if(userBD.compararPassword(body.password)){

            const tokenUsuario = Token.getJwtToken({
                _id: userBD._id,
                rut: userBD.rut,
                nombre: userBD.nombre,
                apellido: userBD.apellido,
                email:userBD.email
            });

            res.json({
                ok: true,
                token: tokenUsuario
            });
        }else{
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos' 
            });
        }
    })
})

//crear usuario
userRoutes.post('/crea_usuario',(req: Request, res: Response)=>{
    const user = {
        rut:req.body.rut,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10)
    };

    Usuario.create(user).then(userBD =>{

        const tokenUsuario = Token.getJwtToken({
            _id: userBD._id,
            rut: userBD.rut,
            nombre: userBD.nombre,
            apellido: userBD.apellido,
            email:userBD.email
        });

        res.json({
            ok: true,
            token: tokenUsuario
        });

        
    }).catch(err =>{
        res.json({
            ok:false,
            err
        });
    })
})

userRoutes.get('/prueba', (req: Request, res: Response) =>{
    res.json({
        ok:true,
        mensaje:'Todo ok!'
    })
});

//actualizar usuario
userRoutes.post('/update', verificaToken,(req: any, res: Response)=>{

    const user = {
        rut: req.body.rut,
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        email: req.body.email || req.usuario.email
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true},(err, userBD)=>{
       if (err) throw err;
       
       if (!userBD){
        return res.json({
            ok:false,
            mensaje: 'No existe un usuario con ese ID'
        });
       }
       const tokenUsuario = Token.getJwtToken({
        _id: userBD._id,
        rut: userBD.rut,
        nombre: userBD.nombre,
        apellido: userBD.apellido,
        email:userBD.email
    });

    res.json({
        ok: true,
        token: tokenUsuario
    });
    });

});

//recuperar contraseña enviando email
userRoutes.post('/recuperar-clave',(req:Request,res:Response)=>{
    const user = {
        rut: req.body.rut
    }
Usuario.findOneAndUpdate(req.body.rut, user, {new: true},(err, userBD)=>{

    if (err) throw err;
       
       if (!userBD){
        return res.json({
            ok:false,
            mensaje: 'No existe un usuario con ese rut'
        });
       }

    res.json({
        ok: true,
        mensaje: 'OK'
    });
    });

})

export default userRoutes;