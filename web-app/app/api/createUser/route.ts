import { db } from "@/db/drizzle"
import { users } from "@/db/user"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try {
       const {name, email, image} = await req.json()
       await db.insert(users).values({
        name,
        email,
        image,
       }).onConflictDoNothing() 
       return NextResponse.json({
        message : "Login Successful",
        success : true,
        data : null  
       })
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message : error,
            success : false,
            data : null,
        })
    }

}