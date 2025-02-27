import jwt from 'jsonwebtoken';

const isAuthenticated = async(req,res,next) => {

    try {
        // console.log("isAuhtenticated is called in try !")
        const token = req.cookies.token;
        // console.log(token)
        
        if(!token){
            return res.status(401).json({
                message:"user not authenticated",
                success:false
            })
        }
 
        const secret = process.env.KEY_SECRET;
        const decode = jwt.verify(token, secret);
        if(!decode){
            return res.status(401).json({
                message:"Invalid TOKEN",
                success:false
            })
        }

        req.id = decode.userid;
        next();

    } catch (error) {
        console.log("not able to authenticate !")
        console.log(error)
    }
}

export default isAuthenticated;