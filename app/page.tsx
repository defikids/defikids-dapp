import { LandingPage } from "@/components/LandingPage";
import { MainLayout } from "@/components/MainLayout";

import Auth from "@/components/Auth";
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
