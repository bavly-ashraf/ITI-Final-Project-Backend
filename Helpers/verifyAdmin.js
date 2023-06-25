const AppError=require('../Helpers/AppError');
const User=require('../Models/Users');

const verifyAdmin=async(req,res,next)=>
{
    const admin=await User.findById(req.id);
    if(!admin)
    {
        return next(new AppError('user not found'));
    }
    else
    {
        if(admin.role!=='admin')
        {
            return next(new AppError('user is not an admin'));
        }
    }
    next();
}  

module.exports=verifyAdmin;