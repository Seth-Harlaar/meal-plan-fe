"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth-check"); // API route to check the auth cookie
      console.log(res);
      if (res.ok) {
        router.replace("/"); // Redirect home once the cookie is available
      } else {
        setTimeout(checkAuth, 500); // Retry after 500ms
      }
    };

    checkAuth();
  }, [router]);

  return <p>Finishing authentication...</p>; // Temporary UI while checking
}