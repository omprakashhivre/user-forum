import axios from "axios";
import { NextURL } from "next/dist/server/web/next-url";
// import axiosInstance from "./axios-instance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

const verifyToken = async (token: string, nextUrl: NextURL) => {
    try {
        const response = await axios(`${nextUrl.origin}/api/v1/verify-token`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.data;
        if (data.status === "success") {
            return data.user as {id:string, name:string, email:string}
        } else {
            console.error("Invalid token:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};

export default verifyToken;