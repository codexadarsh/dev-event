"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import Link from "next/link";
import { get } from "http";
const page = () => {
  const router = useRouter();
  const [data, setData] = useState("");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const getUser = async () => {
    const response = await axios.get("/api/users/me");
    console.log(response.data);
    setData(response.data.data._id);
    toast.success(response.data.message);
  };
  return (
    <div className="">
      <h1>Profile</h1>
      <h2>
        {data === "" ? (
          "Nothing is here"
        ) : (
          <Link href={`/profile/${data}`}>User ID: {data}</Link>
        )}
      </h2>
      <hr />
      <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-lg ">
        Logout
      </button>
      <br />
      <button onClick={getUser} className="bg-blue-500 px-4 py-2 rounded-lg mt-4">
        Get user Details
      </button>
    </div>
  );
};

export default page;
