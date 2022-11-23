import {Schema, model, Document} from 'mongoose';

const registroSchema = new Schema(
    {
        rut_estudiante:{
            type: String,
            required: [true, 'El rut del estudiante es obligatorio']
    
        },
        nombre_estudiante:{
            type: String,
            required: [true, 'El nombre es obligatoria']
    
        },
        asignatura:{
            type: String,
            required: [true, 'La asignatura es obligatoria']
    
        },
        
        nombre_docente:{
            type: String,
            required: [true, 'El nombre del docente es obligatorio']
    
        },
        rut_docente:{
            type: String,
            required: [true, 'El rut del docente es obligatorio']
    
        },
        sala: {
            type: String,
            default: 'La sala es obligatoria'
        },

        fecha:{
            type: String,
            required: [true, 'El fecha es necesaria']
        },
        hora:{
            type: String,
            required: [true, 'La hora es necesaria']
        },
});


interface Iregistro extends Document {
    rut_estudiante: string;
    nombre_estudiante: string;
    asignatura: string;
    nombre_docente: string;
    rut_docente: string;
    sala: string;
    fecha: string;
    hora: string;

}

export const RegistroAsistencia = model<Iregistro>('RegistroAsistencia',registroSchema);