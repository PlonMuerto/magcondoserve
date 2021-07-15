import bcrypt from 'bcryptjs';

const saltEnc = process.env.ENCRIPT;


export const encryptData = async function (dateEncript:any,saltN:number){

    let salt = await bcrypt.genSalt(saltN);

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(dateEncript, salt, function(err, hash) {
            if (err) {
                reject(err)
            }
            resolve(hash)
        });
    });

    try{
        console.log(25);
        
        
        console.log(dateEncript);
        return await bcrypt.hash(dateEncript,salt);
        
        
    }catch(err){
        
        console.log(err);
        throw new Error(err);        
    }
}

export const compareDate = async function(date:any,dateCompare:any){
    return await bcrypt.compare(date,dateCompare);
}
