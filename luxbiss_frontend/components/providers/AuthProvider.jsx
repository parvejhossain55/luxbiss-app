"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }) {
    const { fetchMe, isAuthenticated } = useAuthStore();

    useEffect(() => {   
        fetchMe();
    }, [fetchMe]);

    return <>{children}</>;
}
