import User from "@/database/user.model";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const reqBody = await req.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);

    await User.findOne({ email }).then((user) => {
      if (user) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Signup failed", error },
      { status: 500 }
    );
  }
}
