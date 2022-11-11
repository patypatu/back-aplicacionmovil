import {Router, Request, Response} from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import enviaEmail from '../services/email.service';

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

//generar random para clave
function makeString(): string {

    let outString: string = '';
    let inOptions: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }


//recuperar contraseña enviando email
userRoutes.post('/recuperar-clave',async(req:Request,res:Response)=>{
    const rut = req.body.rut;
    const password = req.body.password;
    
    

    const data = await Usuario.findOne({ rut });
    console.log(data);
    if(data){
        const claveNueva = makeString();
        console.log(claveNueva);

        data.password = bcrypt.hashSync(claveNueva,10);
        const email = data.email;
        data.save();


//async function main() {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: '-',
      pass: '-'
    }
  });

  var mailOptions = {
    from: '-',
    to: email,
    subject: 'Cambio de Clave de RegistrAPP',
    text: 'Su nueva clave es: " '+ claveNueva + ' "'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
//}


        res.status(200).send({success:true,mensaje:"Se ha actualizado su contraseña"})
    }else{
        res.status(200).send({success: false,mensaje:"Usuario no encontrado"})
    }
    
});

export default userRoutes;