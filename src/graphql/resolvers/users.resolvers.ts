import { IResolvers } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


//models
import { UserModel as Users } from '../../models/users';
import { NoticeModel as Notices } from '../../models/news';

const expires = 24*60*60;

interface tokenJWT {
    id:string,
    role:string,
    subscribed:boolean
}

type paramsFilter = string | boolean;
type phoneFilter = number | boolean;

export const Rusers:IResolvers = {
    Query:{
        hellou(parent:null,args,context) {
            console.log(context);
            return "mundo"
        },
        async getUser(parent:null,args,context){
            try{
                
                if(!context.authorization){
                    console.log('xd1')
                    return  Error('no estas autorizado');
                }
                
                let token = context.authorization.split(' ')[1];

                if(!token){
                    console.log('x2')
                    return  Error('no estas autorizado');
                }

                let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

                if(!infoToken.id){
                    console.log('x3')
                    return  Error('no estas autorizado');
                }

                return await Users.findById(infoToken.id);
            }catch(err){
                console.log(err);
            }
        },
        async getFavorites(parent,args,context){
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            let favoritesIds = await Users.findById(infoToken.id,{favorites:1});

            let FavoriteArrayids = favoritesIds?.favorites;

            let lengthOfFavorites = FavoriteArrayids?.length || 0;

            let page = (args.page  || 1)-1;
            
            let perPages = 9;

            let calcPage = (page*perPages);
            
            console.log(calcPage,page);

            let idsArray = FavoriteArrayids?.slice(calcPage,perPages);
            console.log(idsArray);

            let favoritesNotices = Notices.find({_id:{$in:idsArray}})

            let pages = Math.ceil(lengthOfFavorites/perPages);
            return {
                page,
                pages,
                notices:favoritesNotices
            }
        },
        async isFavorite(parent,args,context){
            let { id } = args;
            
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            let isTrue = await Users.findOne({_id:infoToken.id,
                favorites:{
                    $all:[id]
                }
            },{_id:1});

            if(isTrue !== null && isTrue.favorites){
                console.log(true);
                return true;
            }else{
                console.log(false);
                return false;
            }
        },
        async getUsers(parent,args,context){
            console.log('daniel');
            if(!context.authorization){
                
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;


            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            ///params filters
            let name:paramsFilter = args.name  ? args.name : false;
            let email:phoneFilter = args.email  ? args.email : false;
            let phone: paramsFilter = args.phone  ? args.phone : false;
            let country:paramsFilter = args.country ? args.country : false;

            let page = (args.page  || 1)-1;
            
            let perPages = args.pages || 15;

            let calcPage = (page*perPages);

            let Usuarios = Users.find();
            let countUsuarios = Users.countDocuments();

            //filter created for mongoose
            if(name){
                Usuarios.where('name').regex('.*' + name + '.*');
                countUsuarios.where('name').regex('.*' + name + '.*');
            }
    
            if(email){
                Usuarios.where('email').regex('.*' + email + '.*');
                countUsuarios.where('email').regex('.*' + email + '.*');
            }

            if(phone){
                Usuarios.where('phone').regex('.*' + phone + '.*');
                countUsuarios.where('phone').regex('.*' + phone + '.*');
            }

            if(country){
                Usuarios.where('country').regex('.*' + country + '.*');
                countUsuarios.where('country').regex('.*' + country + '.*');
            }

            let users = await Usuarios.skip(calcPage).limit(perPages);

            let length = await countUsuarios;

            console.log(length);

            

            let pages = Math.ceil(length/perPages);

            

            return {
                page,
                pages,
                users
            }
        },
        async getUserslength(parent,args,context){
            
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            
            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            let cantidad = await Users.countDocuments();

            return cantidad;
        },
        async getUsersSubscribeds(parent,args,context){
            let { value } = args;
            
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            return  Users.countDocuments({subscribed:value});
        },
        async getCreatorsLength(parent,args,context){
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }
            return Users.countDocuments({role:"creator"});

        },
        async getUnconfirmedPhoneUsers(parent,args,context){
            let { value } = args;
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            return Users.countDocuments({phoneConfirm:value});
        },
        async getUnconfirmedEmailUsers(parent,args,context){

            let { value } = args;
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id || infoToken.role !== "admin"){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            return Users.countDocuments({emailConfirm:value});
        }
    },
    Mutation:{
        async createUser(parent, args, {globals}){
            try{
                let {name,email,phone,password,country} = args;

                let criptPassword = await bcrypt.hash(password, 12);

                let newUser =  {
                    name,
                    email,
                    password:criptPassword,
                    role: 'user',
                    phone,
                    country,
                    favorites:[]
                };

                let user = await new Users(newUser).save();
                
                let token = await jwt.sign({
                    id:user._id,
                    role:user.role,
                    subscribed:user.subscribed
                },globals.key,{expiresIn:expires});
                
                return token;
                            
            }catch(err){
                console.log(err);
                console.log('error #001');
                /*return err.message;*/

                if(err.errors){
                    let errors:string="";
                    for (let error in err.errors){
                        errors=errors+err.errors[error].message+" , ";
                    }
                    return errors;
                }
                
                //error email ya usado (Nice)
                if (err.code === 11000) {
                    let errors:string="";
                    errors = 'Email ya esta registrado';
                    return errors;
                }
                    
                //errores del nombre
                if (err && err.message) {
                    console.log(err.message)
                    return JSON.stringify(err.message);
                }
    
                //errores no reconocidos
                if (err) return 'server problems in ingress';
            }
        },
        async loginUser(parent,args,{globals}){
            try{
                let user = await Users.findOne({ email:args.email });
                if(user) { 
                    let compare = await bcrypt.compare(args.password,user.password);
                    if(compare){
                        let token = await jwt.sign({
                            id:user._id,
                            role:user.role,
                            subscribed:user.subscribed
                        },globals.key,{expiresIn:expires});
                        console.log(token);
                        return token;
                    }
                    else{
                        return 'no tienes acceso';
                    }
                }else{
                    return 'no tienes acceso';
                }
            }catch(err){  
                console.log(err);
                console.log('error #002');
                
                if(err.errors){
                    let errors:string="";
                    for (let error in err.errors){
                        errors=errors+err.errors[error].message+" , ";
                    }
                    return errors;
                }
                
                //errores del nombre
                if (err && err.message) return "no tienes acceso";
    
                //errores no reconocidos
                if (err) return 'server problems in ingress';
            };
        },
        async toggleFavorite(parent,args,context){
            let { id } = args;
            
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            let updateFavorites = await Users.findOne({_id:infoToken.id,
                favorites:{
                    $all:[id]
                }
            });

            if(updateFavorites){
                let unsave= await Users.updateOne({_id:infoToken.id},{$pull:{favorites:id}});
                console.log('close');
                return false;
            }else{
                let save = await Users.updateOne({_id:infoToken.id},{$push:{favorites:id}});
                console.log('open');
                return true;
            }
        },
        async updateUser(parent,args,context){
            let userData = {...args};
            if(!context.authorization){
                console.log('xd1')
                return  Error('no estas autorizado');
            }
            
            let token = context.authorization.split(' ')[1];

            if(!token){
                console.log('x2')
                return  Error('no estas autorizado');
            }

            let infoToken = await jwt.verify(token,context.globals.key) as tokenJWT;

            if(!infoToken.id){
                console.log('x3')
                return  Error('no estas autorizado');
            }

            let update = await Users.updateOne({_id:infoToken.id},userData);
            
            if(update.ok){
                return true;
            }

            return false;
        }
    }
}