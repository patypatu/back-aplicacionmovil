import {Router, Request, Response} from 'express';
import { RegistroAsistencia } from '../models/registro-asistencia.model'; 

const registroRoutes = Router();

registroRoutes.post('/registro-asistencia',(req:Request, res:Response)=>{

    const registro = {
        rut_estudiante: req.body.rut_estudiante,
        asignatura: req.body.asignatura,
        rut_docente: req.body.rut_docente,
        fecha: req.body.fecha,
        hora: req.body.hora,
        sala: req.body.sala
    }
    RegistroAsistencia.create(registro).then(registroBD =>{
        res.json({
            ok: true,
            message:'guardado el registro'
        });
    }).catch(err =>{
        res.json({
            ok:false,
            message:'No se guardado el registro',
            err
        });
    });
});

registroRoutes.get('/asistencia',(req:Request, res:Response)=>{
    const asistencia = RegistroAsistencia.find({asignatura: req.query.asignatura},(err: any ,registroBD: any)=>{
        if (err) throw err;

        if(!registroBD){
            console.log('Registro no existe');
            return res.json({
                ok:false,
                mensaje: 'No hay registro en la asignatura'
            });
        }else{
            res.json({
                ok:true,
                registros: registroBD
            })
        }
    });
})

export default registroRoutes;