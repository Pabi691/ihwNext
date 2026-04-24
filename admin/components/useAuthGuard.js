import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "./AdminContext";

export function useAuthGuard() {
  const { adminToken, authLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !adminToken) {
      router.replace("/login");
    }
  }, [adminToken, authLoading, router]);

  return { ready: !authLoading && !!adminToken };
}
