import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

//GET handler

export async function GET(req, {params}){
    try {
        await connectToDatabase();

        const user = await User.findById(params.userId);

        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json(user);
    } catch (error) {
        console.log(error);

        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}


export async function DELETE(req,{params}){
    try {
        await connectToDatabase();

        if(!params.userId){
            return NextResponse.json({error: "User id is required"}, {status: 400});
        }

      const user =  await User.findById(params.userId);

      if(!user){
        return NextResponse.json({error: "User not found"}, {status: 404});
      }

      await user.deleteOne();

        return NextResponse.json({message: "User deleted successfully"}, {status: 200});
    } catch (error) {
        console.log(error);

        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}


//PUT handler
export async function PUT(req,{params}){
    try {
       const {currentPassword, newPassword, confirmNewPassword} = await req.json();

       if(!currentPassword || !newPassword || !confirmNewPassword){
           return NextResponse.json({error: "All fields are required"}, {status: 400});
       }

       if(newPassword !== confirmNewPassword){
           return NextResponse.json({error: "Passwords do not match"}, {status: 400});
       }

       await connectToDatabase();

       const user = await User.findById(params.userId);

       if(!user){
           return NextResponse.json({error: "User not found"}, {status: 404});
       }

       const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

       if(!isPasswordCorrect){
           return NextResponse.json({error: "Current password is incorrect"}, {status: 400});
       }

       user.password = await bcrypt.hash(newPassword, 10);

       await user.save();

       return NextResponse.json({message: "Password updated successfully"}, {status: 200});
    } catch (error) {
        console.log(error);

        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}