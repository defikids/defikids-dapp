import { LandingPage } from "@/components/LandingPage";
import { MainLayout } from "@/components/main_layout";

import Auth from "@/components/auth";
import { Box } from "@chakra-ui/react";

export default function Page() {
  return (
    <Box>
      <Auth />
      <MainLayout />
      <LandingPage />
    </Box>
  );
}
