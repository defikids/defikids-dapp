import { Box } from "@chakra-ui/react";
import ParentDashboardClientLayout from "@/components/dashboards/parentDashboard/ParentDashboardClientLayout";

export default async function ParentDashboard(context: any) {
  return (
    <Box height="100vh">
      <ParentDashboardClientLayout />
    </Box>
  );
}
