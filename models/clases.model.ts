import {Schema, model, Document} from 'mongoose';
 
const clasesSchema = new Schema(
    {
        asignatura:{
            type: String,
            required:[true,'La asignatura es obligatoria.']
        },
        fecha_clase:{
            type: Date,
            default: Date
        },
        sala:{
            type: String,
            required:[true,'La sala es obligatoria.']
        },
        horario:{
            type: String,
            required:[true,'El horario es obligatorio.']
        },
    }
);
 
interface Iclases extends Document {
    asignatura: String;
    fecha_clase: Date;
    sala: String;
    horario: String;
}
 
export const Clases = model<Iclases>('Clases', clasesSchema);