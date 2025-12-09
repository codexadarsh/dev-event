import User from "@/database/user.model";
import getData from "@/lib/getData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userID = await getData(request);
    const user = await User.findById({_id:userID}).select("-password");
    return NextResponse.json({
        message: "user not found",
        data: user
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
