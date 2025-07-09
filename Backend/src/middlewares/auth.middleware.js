import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protect = async (req,res,next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next()
        }else{
            res.status(401).json({
                message : "Not Authorized!. No token found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "Token Failed",
            error : error.message
        })
    }
}

export default protect;