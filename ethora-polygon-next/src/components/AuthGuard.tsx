import { useEffect } from "react";

import { useRouter } from "next/router";
import { useAppStore } from "../store";

export function AuthGuard({children}: { children: JSX.Element }) {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (!user.firstName && router.pathname !== '/') {
      // router.push('/')
    }
  }, [router, user]);

  return (
    <>{children}</>
  )
}