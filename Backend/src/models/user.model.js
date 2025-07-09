import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            unique : true,
            lowercase : true
        },
        email : {
            type : String,
            required : true,
            unique :true
        },
        password : {
            type : String,
            required : [true, "Password is Required"]
        }
    },
{timestamps : true});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema)