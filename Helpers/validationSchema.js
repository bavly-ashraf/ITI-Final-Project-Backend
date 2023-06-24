const joi=require('joi');

const schema = joi.object
({
    email: 
        joi.string()
        .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
        .required(),

    username: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    password: joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
    password_confirm: joi.ref('password')

})

const passwordSchema = joi.object
({
    password: joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
    password_confirm: joi.ref('password')

})

const verifySignUp=async(req,res,next)=>{
    const { email,username,role,password,password_confirm }=req.body;
    try{
        await schema.validateAsync({ email,username,password,password_confirm });
    }
    catch(err){
            return next(err);
        }
    next();
}

module.exports={schema,verifySignUp,passwordSchema};