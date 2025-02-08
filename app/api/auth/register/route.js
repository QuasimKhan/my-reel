import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req) {

    try {
       const {name, email, password} = await req.json();

       if(!name || !email || !password){
           return NextResponse.json({error: "All fields are required"}, {status: 400});
       }

       await connectToDatabase();

       const existingUser = await User.findOne({email})

       if(existingUser){
           return NextResponse.json({error: "User already exists"}, {status: 400});
       }


       await User.create({
        name, email, password
       })


       return NextResponse.json({message: "User registered successfully"}, {status: 201});
        
    } catch (error) {
        console.log(error);

        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}