import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,   
        trim: true,  // remove spaces
        lowercase: true
    },

    password: {
        type: String,
        required: true
    }
},{timestamps: true});


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }

    next();
})


const User = mongoose.models?.User || mongoose.model("User", userSchema)

export default User