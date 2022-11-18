import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema(
    {
        rut:{
            type: String,
            required: [true, 'El rut es obligatorio']
    
        },
        nombre:{
            type: String,
            required: [true, 'El nombre es obligatorio']
    
        },
        apellido:{
            type: String,
            required: [true, 'El apellido es obligatorio']
    
        },
        email:{
            type: String,
            unique: true,
            required: [true, 'El correo es necesario']
        },
        password:{
            type: String,
            required: [true, 'La contraseña es necesaria']
        },
        role: {
            type: String,
            default: 'estudiante'
        },
});

usuarioSchema.method('compararPassword', function(password:string =''):boolean{

    if(bcrypt.compareSync(password,this.password)){
        return true;
    }else{
        return false;
    }

});

interface Iusuario extends Document {
    rut: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    role: string;

    compararPassword(password: string):boolean;
}

export const Usuario = model<Iusuario>('Usuario',usuarioSchema);