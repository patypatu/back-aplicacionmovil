import Server from "./classes/server";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoutes from './routes/usuario';
import postRoutes from './routes/post.routes';
import registroRoutes from "./routes/registro-asistencia.routes";
import cors from 'cors';



const server = new Server();

//bodyparser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//configurar cors
server.app.use(cors({origin: true, credentials: true}));

//rutas de mi app
server.app.use('/api',userRoutes)
server.app.use('/posts',postRoutes)
server.app.use('/registro', registroRoutes)

//conectar db
mongoose.connect(process.env.MONGOCONNECT || '');
console.log('ok db');

//levantar express
server.start( ()=>{
    console.log(`Servidor corriendo en puerto ${server.port}` );
})
