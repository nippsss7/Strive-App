import jwt from 'jsonwebtoken';

const isAuthenticated = async(req,res,next) => {

    try {
        console.log("isAuhtenticated is called in try !")
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
        console.error("JWT authentication failed:", error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
    });
    }
}

export default isAuthenticated;