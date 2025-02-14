"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      var res = await fetch("/api/auth-check");
      while(!res.ok){
        res = await fetch("/api/auth-check");
        console.log(res);
      } 

      router.replace("/"); // Redirect home once the cookie is available
    };

    checkAuth();
  }, [router]);

  return <p>Finishing authentication...</p>; // Temporary UI while checking
}