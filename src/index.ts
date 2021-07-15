import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './graphql';

import dotenv from 'dotenv'

//env
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();    
}

//BBDD
import './database/BBDD';

const app = express ();

app.use('/files', express.static('files'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//routes
import mainRutes from './rutes/index';

app.use('/',mainRutes);

const server = new ApolloServer({
    schema,
    playground:true,
    introspection:true,
    context:({req})=>{
        return{
            authorization:req.headers.authorization,
            globals:{
                key:process.env.KEY,
                encript:process.env.ENCRIPT
            }
        }
    }
});

server.applyMiddleware({ app });

app.listen(5200,()=>{
    console.log('http://localhost:5000');
})