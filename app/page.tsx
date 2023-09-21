"use client";

import { LandingPage } from "@/components/LandingPage";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Page() {
  const [emailRoute, setEmailRoute] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  /*
   * This hook handle routing to the correct page after arriving from an email link
   */
  useEffect(() => {
    if (pathname?.startsWith("/member-invite")) {
      setEmailRoute("member-invite");
      router.push("/member-invite");
    }
    if (pathname?.startsWith("/confirm-email")) {
      setEmailRoute("confirm-email");
      router.push("/confirm-email");
    }
  }, []);

  return <Box>{emailRoute ? <></> : <LandingPage />}</Box>;
}
